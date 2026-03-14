
import React from 'react';
import type { ToggleSwitchProps } from '../types/settings.types';

/**
* A custom styled toggle switch built with Tailwind CSS for boolean state management.
* {boolean} checked - The current state of the switch (on/off).
* {() => void} onChange - The event handler that is triggered when the switch is clicked.
* {boolean} [disabled=false] - Optional flag to disable user interaction.
* {string} ariaLabel - Accessibility label for screen readers.
*/
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    ariaLabel
}) => {
    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
                ${checked ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${checked ? 'translate-x-6 scale-110' : 'translate-x-1'}
                `}
            />
        </button>
    );
};

export default ToggleSwitch;