"""
Insurance Payout Migration (Innovation 7: Z-Score Insurance)
"""
from alembic import op
import sqlalchemy as sa

revision = '003'
down_revision = '002'

def upgrade():
    op.create_table('insurance_payouts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('period_start', sa.Date(), nullable=False),
        sa.Column('period_end', sa.Date(), nullable=False),
        sa.Column('earnings', sa.Float(), nullable=False),
        sa.Column('mean_earnings', sa.Float(), nullable=False),
        sa.Column('std_earnings', sa.Float(), nullable=False),
        sa.Column('z_score', sa.Float(), nullable=False),
        sa.Column('payout_amount', sa.Float(), nullable=False),
        sa.Column('is_paid', sa.Boolean(), default=False),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_insurance_driver_id', 'insurance_payouts', ['driver_id'])
    op.create_index('ix_insurance_period', 'insurance_payouts', ['period_start', 'period_end'])

def downgrade():
    op.drop_table('insurance_payouts')
