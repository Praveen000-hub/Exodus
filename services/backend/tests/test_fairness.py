"""
Fairness Algorithm Tests
"""

import pytest
import numpy as np
from app.core.fairness import FairnessOptimizer


def test_fairness_optimizer():
    """Test PuLP fairness optimizer"""
    optimizer = FairnessOptimizer()
    
    drivers = [1, 2, 3]
    packages = [101, 102, 103, 104, 105, 106]
    
    # Create difficulty matrix
    difficulty_matrix = np.random.uniform(30, 70, size=(3, 6))
    
    # Run optimization
    assignments = optimizer.optimize_assignments(
        drivers=drivers,
        packages=packages,
        difficulty_matrix=difficulty_matrix,
        max_packages_per_driver=3,
        min_packages_per_driver=1
    )
    
    # Verify all packages assigned
    assigned_packages = []
    for driver_packages in assignments.values():
        assigned_packages.extend(driver_packages)
    
    assert len(assigned_packages) == len(packages)
    assert set(assigned_packages) == set(packages)
    
    # Verify package count constraints
    for driver_id, driver_packages in assignments.items():
        assert 1 <= len(driver_packages) <= 3
