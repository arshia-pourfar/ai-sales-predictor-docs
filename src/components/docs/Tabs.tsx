'use client';
import { useState } from 'react';

export function Tabs({ children }: { children: React.ReactElement<TabProps>[] }) {
    const [active, setActive] = useState(0);
    const tabs = children.map((child) => child.props.label);

    return (
        <div>
            <div className="flex gap-2 border-b border-gray-800 mb-6">
                {tabs.map((tab, i) => (
                    <button key={i} onClick={() => setActive(i)} className={`px-4 py-2 text-sm ${i === active ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            <div>{children[active]}</div>
        </div>
    );
}

interface TabProps {
    label: string;
    children: React.ReactNode;
}
Tabs.Tab = function Tab({ children }: TabProps) {
    return <>{children}</>;
};