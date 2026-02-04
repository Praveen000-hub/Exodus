"""
Fairness Algorithm - Innovation 4
PuLP-based optimization for fair package assignment
"""

import numpy as np
from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus, PULP_CBC_CMD
from typing import List, Dict, Tuple

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class FairnessOptimizer:
    """
    PuLP-based fairness optimizer for package assignment
    
    Minimizes total difficulty while ensuring fair distribution
    using linear programming
    """
    
    def __init__(self):
        self.problem = None
        self.variables = {}
    
    def optimize_assignments(
        self,
        drivers: List[int],
        packages: List[int],
        difficulty_matrix: Dict[Tuple[int, int], float],
        max_packages_per_driver: int = None,
        min_packages_per_driver: int = None
    ) -> Dict[int, List[int]]:
        """
        **INNOVATION 4: Fair Package Assignment using PuLP**
        
        Optimize package assignments to drivers
        
        Args:
            drivers: List of driver IDs
            packages: List of package IDs
            difficulty_matrix: 2D array [drivers x packages] with difficulty scores
            max_packages_per_driver: Maximum packages per driver
            min_packages_per_driver: Minimum packages per driver
        
        Returns:
            Dict[driver_id, List[package_ids]]: Optimized assignments
        
        Algorithm:
        1. Create binary decision variables x[i,j] (driver i gets package j)
        2. Objective: Minimize total weighted difficulty
        3. Constraints:
           - Each package assigned to exactly 1 driver
           - Each driver gets min-max packages (fairness)
           - Difficulty variance constraint (equity)
        """
        if max_packages_per_driver is None:
            max_packages_per_driver = settings.FAIRNESS_MAX_PACKAGES_PER_DRIVER
        
        if min_packages_per_driver is None:
            min_packages_per_driver = settings.FAIRNESS_MIN_PACKAGES_PER_DRIVER
        
        num_drivers = len(drivers)
        num_packages = len(packages)
        
        logger.info(f"Starting fairness optimization: {num_drivers} drivers, {num_packages} packages")
        
        # Create optimization problem
        self.problem = LpProblem("Fair_Package_Assignment", LpMinimize)
        
        # Decision variables: x[i,j] = 1 if driver i gets package j
        self.variables = {}
        for i, driver_id in enumerate(drivers):
            for j, package_id in enumerate(packages):
                var_name = f"x_{driver_id}_{package_id}"
                self.variables[(i, j)] = LpVariable(var_name, cat='Binary')
        
        # Objective: Minimize total difficulty
        objective = lpSum([
            difficulty_matrix.get((drivers[i], packages[j]), 0) * self.variables[(i, j)]
            for i in range(num_drivers)
            for j in range(num_packages)
        ])
        self.problem += objective
        
        # Constraint 1: Each package assigned to exactly one driver
        for j in range(num_packages):
            self.problem += (
                lpSum([self.variables[(i, j)] for i in range(num_drivers)]) == 1,
                f"package_{packages[j]}_assigned_once"
            )
        
        # Constraint 2: Each driver gets between min and max packages
        avg_packages = num_packages / num_drivers
        
        for i in range(num_drivers):
            # Maximum constraint
            self.problem += (
                lpSum([self.variables[(i, j)] for j in range(num_packages)]) <= max_packages_per_driver,
                f"driver_{drivers[i]}_max_packages"
            )
            
            # Minimum constraint
            self.problem += (
                lpSum([self.variables[(i, j)] for j in range(num_packages)]) >= min_packages_per_driver,
                f"driver_{drivers[i]}_min_packages"
            )
        
        # Constraint 3: Fairness - limit difficulty variance
        # Calculate average difficulty per driver
        avg_difficulty_per_driver = []
        for i in range(num_drivers):
            total_difficulty = lpSum([
                difficulty_matrix.get((drivers[i], packages[j]), 0) * self.variables[(i, j)]
                for j in range(num_packages)
            ])
            avg_difficulty_per_driver.append(total_difficulty)
        
        # Limit variance from mean (within tolerance)
        # Calculate average difficulty across all assignments
        all_difficulties = [
            difficulty_matrix.get((drivers[i], packages[j]), 0)
            for i in range(num_drivers)
            for j in range(num_packages)
        ]
        global_avg = sum(all_difficulties) / len(all_difficulties) if all_difficulties else 1.0
        tolerance = settings.FAIRNESS_VARIANCE_THRESHOLD
        
        for i in range(num_drivers):
            # Upper bound
            self.problem += (
                avg_difficulty_per_driver[i] <= global_avg + tolerance,
                f"driver_{drivers[i]}_difficulty_upper"
            )
            
            # Lower bound
            self.problem += (
                avg_difficulty_per_driver[i] >= global_avg - tolerance,
                f"driver_{drivers[i]}_difficulty_lower"
            )
        
        # Solve the problem
        logger.info("Solving linear programming problem...")
        solver = PULP_CBC_CMD(msg=0)  # Suppress solver output
        self.problem.solve(solver)
        
        # Check solution status
        status = LpStatus[self.problem.status]
        logger.info(f"Optimization status: {status}")
        
        if status != "Optimal":
            logger.warning(f"Optimization did not find optimal solution: {status}")
            # Fallback to greedy assignment
            return self._greedy_fallback(drivers, packages, difficulty_matrix)
        
        # Extract assignments from solution
        assignments = {driver_id: [] for driver_id in drivers}
        
        for i, driver_id in enumerate(drivers):
            for j, package_id in enumerate(packages):
                if self.variables[(i, j)].varValue == 1:
                    assignments[driver_id].append(package_id)
        
        # Log fairness metrics
        self._log_fairness_metrics(drivers, assignments, difficulty_matrix)
        
        return assignments
    
    def _greedy_fallback(
        self,
        drivers: List[int],
        packages: List[int],
        difficulty_matrix: Dict[Tuple[int, int], float]
    ) -> Dict[int, List[int]]:
        """
        Greedy fallback algorithm if optimization fails
        Assigns packages to drivers with lowest current total difficulty
        """
        logger.warning("Using greedy fallback algorithm")
        
        assignments = {driver_id: [] for driver_id in drivers}
        driver_difficulties = {driver_id: 0.0 for driver_id in drivers}
        
        # Sort packages by average difficulty (hardest first)
        package_avg_difficulties = []
        for package_id in packages:
            avg_diff = np.mean([
                difficulty_matrix.get((driver_id, package_id), 0)
                for driver_id in drivers
            ])
            package_avg_difficulties.append((package_id, avg_diff))
        package_avg_difficulties.sort(key=lambda x: x[1], reverse=True)
        
        # Assign each package to driver with lowest current difficulty
        for package_id, _ in package_avg_difficulties:
            # Find driver with minimum current difficulty
            min_driver = min(drivers, key=lambda d: driver_difficulties[d])
            
            # Assign package
            assignments[min_driver].append(package_id)
            driver_difficulties[min_driver] += difficulty_matrix.get((min_driver, package_id), 0)
        
        return assignments
    
    def _log_fairness_metrics(
        self,
        drivers: List[int],
        assignments: Dict[int, List[int]],
        difficulty_matrix: Dict[Tuple[int, int], float]
    ):
        """
        Log fairness metrics for monitoring
        """
        # Calculate per-driver statistics
        package_counts = [len(assignments[d]) for d in drivers]
        
        difficulties = []
        for driver_id in drivers:
            total_difficulty = sum(
                difficulty_matrix.get((driver_id, p), 0)
            )
            difficulties.append(total_difficulty)
        
        # Gini coefficient (inequality measure)
        gini = self._calculate_gini(difficulties)
        
        logger.info(f"Fairness Metrics:")
        logger.info(f"  Package distribution: min={min(package_counts)}, max={max(package_counts)}, avg={np.mean(package_counts):.1f}")
        logger.info(f"  Difficulty distribution: min={min(difficulties):.2f}, max={max(difficulties):.2f}, avg={np.mean(difficulties):.2f}")
        logger.info(f"  Gini coefficient: {gini:.4f} (0=perfect equality, 1=perfect inequality)")
        logger.info(f"  Variance: {np.var(difficulties):.2f}")
    
    def _calculate_gini(self, values: List[float]) -> float:
        """
        Calculate Gini coefficient (inequality measure)
        0 = perfect equality, 1 = perfect inequality
        """
        sorted_values = sorted(values)
        n = len(sorted_values)
        cumsum = np.cumsum(sorted_values)
        
        return (2 * np.sum((np.arange(1, n + 1)) * sorted_values)) / (n * cumsum[-1]) - (n + 1) / n
