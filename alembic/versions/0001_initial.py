"""Initial migration: create all tables for TradeSphere."""
from alembic import op
import sqlalchemy as sa
import enum

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'users',
<<<<<<< HEAD
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
=======
        sa.Column('id', sa.String(), primary_key=True),
>>>>>>> MK
        sa.Column('username', sa.String(), unique=True, nullable=False),
        sa.Column('email', sa.String(), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('tier', sa.Enum('BEGINNER', 'INTERMEDIATE', 'ADVANCED', name='tierenum'), default='BEGINNER'),
        sa.Column('cash_balance', sa.Numeric(20, 4), default=100000.0),
        sa.Column('is_admin', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_table(
        'positions',
<<<<<<< HEAD
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
=======
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=False),
>>>>>>> MK
        sa.Column('symbol', sa.String(), nullable=False),
        sa.Column('market', sa.Enum('US', 'IN', name='marketenum'), nullable=False),
        sa.Column('shares', sa.Numeric(20, 8), nullable=False),
        sa.Column('avg_price', sa.Numeric(20, 8), nullable=False),
        sa.Column('borrow_rate_annual', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_table(
        'transactions',
<<<<<<< HEAD
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
=======
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=False),
>>>>>>> MK
        sa.Column('symbol', sa.String(), nullable=False),
        sa.Column('market', sa.Enum('US', 'IN', name='marketenum'), nullable=False),
        sa.Column('type', sa.Enum('BUY', 'SELL', 'SHORT', 'COVER', name='transactiontype'), nullable=False),
        sa.Column('quantity', sa.Numeric(20, 8), nullable=False),
        sa.Column('price', sa.Numeric(20, 8), nullable=False),
        sa.Column('fees', sa.Numeric(20, 8), default=0.0),
        sa.Column('total_amount', sa.Numeric(20, 8), nullable=False),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_table(
        'shortable_stocks',
        sa.Column('symbol', sa.String(), primary_key=True),
        sa.Column('market', sa.Enum('US', 'IN', name='marketenum'), nullable=False),
        sa.Column('borrow_rate_annual', sa.Float(), nullable=False),
        sa.Column('available', sa.Boolean(), default=True),
        sa.Column('last_updated', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_table(
        'equity_snapshots',
<<<<<<< HEAD
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
=======
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=False),
>>>>>>> MK
        sa.Column('total_equity', sa.Numeric(20, 4), nullable=False),
        sa.Column('maintenance_required', sa.Numeric(20, 4), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

def downgrade():
    op.drop_table('equity_snapshots')
    op.drop_table('shortable_stocks')
    op.drop_table('transactions')
    op.drop_table('positions')
    op.drop_table('users')
