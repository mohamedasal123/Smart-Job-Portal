import { Link } from 'react-router-dom';
import AdminEmptyState from './AdminEmptyState';
import AdminRoleBadge from './AdminRoleBadge';
import AdminStatusBadge from './AdminStatusBadge';

export default function AdminUserTable({ users, onStatusAction }) {
  if (!users.length) {
    return <AdminEmptyState title="No users match your filters" message="Try a different search, role, status, or sort option." />;
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
      <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-sm bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
        <div className="col-span-3">User</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2 flex justify-center">Verification</div>
        <div className="col-span-2 flex justify-center">Status</div>
        <div className="col-span-1 text-center">Created</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>
      {users.map((user) => (
        <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-md border-t border-outline-variant items-center" key={user.id}>
          <div className="col-span-3 min-w-0">
            <Link className="font-h3 text-h3 text-primary hover:text-secondary truncate block" to={`/admin/users/${user.id}`}>{user.name}</Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user.email}</p>
          </div>
          <div className="col-span-2"><AdminRoleBadge role={user.role} /></div>
          <div className="col-span-2 flex justify-center"><AdminStatusBadge status={user.verificationStatus} /></div>
          <div className="col-span-2 flex justify-center"><AdminStatusBadge status={user.accountStatus} /></div>
          <div className="col-span-1 text-center text-on-surface-variant text-sm truncate" title={user.createdAt}>{user.createdAt}</div>
          <div className="col-span-2 flex justify-center gap-2">
            <Link className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" title="View details" to={`/admin/users/${user.id}`}>
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </Link>
            <button
              className={`p-2 rounded-lg transition-colors ${user.accountStatus === 'banned' ? 'text-success hover:bg-success-container/20' : 'text-error hover:bg-error-container'}`}
              onClick={() => onStatusAction(user)}
              title={user.accountStatus === 'banned' ? 'Unban' : 'Ban'}
            >
              <span className="material-symbols-outlined text-[20px]">{user.accountStatus === 'banned' ? 'lock_open' : 'block'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
