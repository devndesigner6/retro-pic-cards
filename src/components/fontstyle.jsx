import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const fonts = [
    { name: "System Default", value: "sans-serif" },
    { name: "Roboto", value: "'Roboto', sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Instrument Serif", value: "'Instrument Serif', serif" },
    { name: "Courier New", value: "'Courier New', monospace" },
    { name: "Lora", value: "'Lora', serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Oswald", value: "'Oswald', sans-serif" },
    { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
    { name: "Inter", value: "'Inter', sans-serif" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Playfair Display", value: "'Playfair Display', serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Geist", value: "'Geist', 'Inter', sans-serif" },
    { name: "Impact", value: "Impact, sans-serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Ubuntu", value: "'Ubuntu', sans-serif" },
    { name: "Palatino", value: "'Palatino Linotype', serif" },
    { name: "Garamond", value: "Garamond, serif" },
    { name: "Lucida Console", value: "'Lucida Console', monospace" },
    { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { name: "Consolas", value: "Consolas, monospace" },
];

function FontStyle({ selectedFont, onFontChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (font) => {
        onFontChange(font.value);
        setIsOpen(false);
    };

    const currentFontName = fonts.find(f => f.value === selectedFont)?.name || "System Default";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="border-3 rounded-md p-2.5 w-70 text-lg font-semibold flex justify-between items-center bg-white cursor-pointer hover:bg-neutral-50 transition-colors"
            >
                <span className="truncate mr-2">{currentFontName}</span>
                <ChevronDown size={20} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-70 mt-2 bg-white border-3 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {fonts.map((font) => (
                        <div
                            key={font.name}
                            onClick={() => handleSelect(font)}
                            className={`px-4 py-2 cursor-pointer hover:bg-neutral-100 flex items-center justify-between ${selectedFont === font.value ? 'bg-neutral-50' : ''}`}
                            style={{ fontFamily: font.value }}
                        >
                            <span className="text-base">{font.name}</span>
                            {selectedFont === font.value && <Check size={16} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FontStyle;
