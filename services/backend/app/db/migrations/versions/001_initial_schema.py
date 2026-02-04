"""
Initial Database Schema Migration
Creates all core tables for FairAI system
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Drivers table
    op.create_table('drivers',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), unique=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('phone', sa.String(20), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('vehicle_type', sa.Enum('bike', 'scooter', 'car', 'van', name='vehicle_type'), nullable=False),
        sa.Column('vehicle_number', sa.String(50), unique=True, nullable=True),
        sa.Column('vehicle_capacity_kg', sa.Float(), default=50.0),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_available', sa.Boolean(), default=True),
        sa.Column('experience_days', sa.Integer(), default=0),
        sa.Column('total_deliveries', sa.Integer(), default=0),
        sa.Column('successful_deliveries', sa.Integer(), default=0),
        sa.Column('failed_deliveries', sa.Integer(), default=0),
        sa.Column('avg_delivery_time_minutes', sa.Float(), default=30.0),
        sa.Column('avg_rating', sa.Float(), default=5.0),
        sa.Column('current_latitude', sa.Float(), nullable=True),
        sa.Column('current_longitude', sa.Float(), nullable=True),
        sa.Column('last_location_update', sa.DateTime(timezone=True), nullable=True),
        sa.Column('fcm_token', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_drivers_user_id', 'drivers', ['user_id'])
    op.create_index('ix_drivers_email', 'drivers', ['email'])
    op.create_index('ix_drivers_phone', 'drivers', ['phone'])
    
    # Packages table
    op.create_table('packages',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('tracking_number', sa.String(100), unique=True, nullable=False),
        sa.Column('weight_kg', sa.Float(), nullable=False),
        sa.Column('priority', sa.Enum('low', 'medium', 'high', 'urgent', name='priority_type'), nullable=False),
        sa.Column('pickup_latitude', sa.Float(), nullable=False),
        sa.Column('pickup_longitude', sa.Float(), nullable=False),
        sa.Column('pickup_address', sa.String(500), nullable=False),
        sa.Column('dropoff_latitude', sa.Float(), nullable=False),
        sa.Column('dropoff_longitude', sa.Float(), nullable=False),
        sa.Column('dropoff_address', sa.String(500), nullable=False),
        sa.Column('distance_km', sa.Float(), nullable=False),
        sa.Column('estimated_time_minutes', sa.Float(), nullable=False),
        sa.Column('requires_cold_chain', sa.Boolean(), default=False),
        sa.Column('is_fragile', sa.Boolean(), default=False),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('customer_phone', sa.String(20), nullable=False),
        sa.Column('delivery_window_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('delivery_window_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.Enum('pending', 'assigned', 'in_transit', 'delivered', 'failed', name='package_status'), default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_packages_tracking_number', 'packages', ['tracking_number'])
    op.create_index('ix_packages_status', 'packages', ['status'])
    
    # Assignments table
    op.create_table('assignments',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('package_id', sa.Integer(), sa.ForeignKey('packages.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assignment_date', sa.Date(), nullable=False),
        sa.Column('predicted_difficulty', sa.Float(), nullable=False),
        sa.Column('actual_difficulty', sa.Float(), nullable=True),
        sa.Column('is_accepted', sa.Boolean(), default=False),
        sa.Column('is_completed', sa.Boolean(), default=False),
        sa.Column('is_failed', sa.Boolean(), default=False),
        sa.Column('assigned_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('accepted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('shap_explanation_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_assignments_driver_id', 'assignments', ['driver_id'])
    op.create_index('ix_assignments_package_id', 'assignments', ['package_id'])
    op.create_index('ix_assignments_assignment_date', 'assignments', ['assignment_date'])
    
    # Deliveries table
    op.create_table('deliveries',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('assignment_id', sa.Integer(), sa.ForeignKey('assignments.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('actual_distance_km', sa.Float(), nullable=True),
        sa.Column('actual_time_minutes', sa.Float(), nullable=True),
        sa.Column('customer_rating', sa.Integer(), nullable=True),
        sa.Column('customer_feedback', sa.Text(), nullable=True),
        sa.Column('failed_reason', sa.String(500), nullable=True),
        sa.Column('proof_of_delivery_url', sa.String(500), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_deliveries_assignment_id', 'deliveries', ['assignment_id'])
    
    # Health Events table
    op.create_table('health_events',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('event_type', sa.Enum('long_shift', 'fast_deliveries', 'missed_breaks', 'accident', name='health_event_type'), nullable=False),
        sa.Column('severity', sa.Enum('low', 'medium', 'high', 'critical', name='severity_type'), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('recommended_action', sa.String(500), nullable=True),
        sa.Column('is_resolved', sa.Boolean(), default=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_health_events_driver_id', 'health_events', ['driver_id'])
    op.create_index('ix_health_events_event_type', 'health_events', ['event_type'])
    
    # GPS Logs table
    op.create_table('gps_logs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('speed_kmh', sa.Float(), nullable=True),
        sa.Column('accuracy_meters', sa.Float(), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_gps_logs_driver_id', 'gps_logs', ['driver_id'])
    op.create_index('ix_gps_logs_timestamp', 'gps_logs', ['timestamp'])
    
    # Admins table
    op.create_table('admins',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', sa.Enum('manager', 'super_admin', name='admin_role'), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_admins_email', 'admins', ['email'])


def downgrade():
    op.drop_table('gps_logs')
    op.drop_table('health_events')
    op.drop_table('deliveries')
    op.drop_table('assignments')
    op.drop_table('packages')
    op.drop_table('drivers')
    op.drop_table('admins')
    op.execute('DROP TYPE IF EXISTS vehicle_type')
    op.execute('DROP TYPE IF EXISTS priority_type')
    op.execute('DROP TYPE IF EXISTS package_status')
    op.execute('DROP TYPE IF EXISTS health_event_type')
    op.execute('DROP TYPE IF EXISTS severity_type')
    op.execute('DROP TYPE IF EXISTS admin_role')
