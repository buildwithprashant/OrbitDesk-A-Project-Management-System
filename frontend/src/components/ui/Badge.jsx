import clsx from 'clsx';

export default function Badge({ children, className = '' }) {
  return <span className={clsx('rounded-full px-3 py-1 text-xs font-bold', className)}>{children}</span>;
}
