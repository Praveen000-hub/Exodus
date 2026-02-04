"""
Swap Table Migration (Innovation 6: P2P Swap Marketplace)
"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'

def upgrade():
    op.create_table('swaps',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('requester_driver_id', sa.Integer(), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_driver_id', sa.Integer(), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('requester_assignment_id', sa.Integer(), sa.ForeignKey('assignments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_assignment_id', sa.Integer(), sa.ForeignKey('assignments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('requester_reason', sa.Text(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'accepted', 'rejected', 'cancelled', name='swap_status'), default='pending'),
        sa.Column('responded_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_swaps_requester_driver_id', 'swaps', ['requester_driver_id'])
    op.create_index('ix_swaps_target_driver_id', 'swaps', ['target_driver_id'])

def downgrade():
    op.drop_table('swaps')
    op.execute('DROP TYPE IF EXISTS swap_status')
