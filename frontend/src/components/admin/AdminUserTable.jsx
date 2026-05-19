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
        <div className="col-span-2">Verification</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Created</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {users.map((user) => (
        <div className="grid grid-cols-12 gap-stack-md px-stack-lg py-stack-md border-t border-outline-variant items-center" key={user.id}>
          <div className="col-span-3">
            <Link className="font-h3 text-h3 text-primary hover:text-secondary" to={`/admin/users/${user.id}`}>{user.name}</Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user.email}</p>
          </div>
          <div className="col-span-2"><AdminRoleBadge role={user.role} /></div>
          <div className="col-span-2"><AdminStatusBadge status={user.verificationStatus} /></div>
          <div className="col-span-2"><AdminStatusBadge status={user.accountStatus} /></div>
          <div className="col-span-1 text-on-surface-variant">{user.createdAt}</div>
          <div className="col-span-2 flex justify-end gap-unit">
            <Link className="p-2 rounded-lg hover:bg-surface-container-high" title="View details" to={`/admin/users/${user.id}`}>
              <span className="material-symbols-outlined">visibility</span>
            </Link>
            <button
              className={`p-2 rounded-lg hover:bg-surface-container-high ${user.accountStatus === 'banned' ? 'text-[#15803D]' : 'text-error'}`}
              onClick={() => onStatusAction(user)}
              title={user.accountStatus === 'banned' ? 'Unban' : 'Ban'}
            >
              <span className="material-symbols-outlined">{user.accountStatus === 'banned' ? 'lock_open' : 'block'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
