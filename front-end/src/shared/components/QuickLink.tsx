'use client';

import Link from 'next/link';

interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export function QuickLink({ title, description, href, icon, color }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className={`block p-4 rounded-lg border-2 hover:shadow-md transition-all duration-200 ${color}`}
    >
      <div className='flex items-center space-x-3'>
        <span className='text-xl'>{icon}</span>
        <div>
          <h4 className='font-medium'>{title}</h4>
          <p className='text-sm opacity-75'>{description}</p>
        </div>
      </div>
    </Link>
  );
}
