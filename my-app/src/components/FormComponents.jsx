import React from 'react';

// Text Input
export function TextInput({
    label,
    id,
    name,
    type = 'text',
    value = '',
    onChange,
    required = false,
    placeholder = '',
    pattern,
    title
}) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                pattern={pattern}
                title={title}
                className="form-control"
            />
        </div>
    );
}

// Textarea Input
export function TextAreaInput({
    label,
    id,
    name,
    value = '',
    onChange,
    required = false,
    placeholder = '',
    rows = 3
}) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                className="form-control"
            />
        </div>
    );
}

// Date Input
export function DateInput({
    label,
    id,
    name,
    required = false
}) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <input
                type="date"
                id={id}
                name={name}
                required={required}
                className="form-control"
            />
        </div>
    );
}

// Checkbox Input
export function CheckboxInput({
    label,
    id,
    name
}) {
    return (
        <div className="mb-4">
            <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">{label}</span>
            </label>
        </div>
    );
}

// Select Input
export function SelectInput({
    label,
    id,
    name,
    options = [],
    required = false
}) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <select
                id={id}
                name={name}
                required={required}
                className="form-control"
            >
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

// Form Section
export function FormSection({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h2>}
            {children}
        </div>
    );
} 