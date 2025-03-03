import React, { useState, useEffect } from 'react';
import '../styles/PasswordGenerator.css';
import { generatePassword } from '../utils/utils';

const PasswordGenerator = () => {
    const [length, setLength] = useState(8);
    const [includeLower, setIncludeLower] = useState(true);
    const [includeUpper, setIncludeUpper] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [password, setPassword] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [savedPasswords, setSavedPasswords] = useState([]);

    useEffect(() => {
        fetchPasswords();
    }, []);

    const fetchPasswords = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/passwords');
            const data = await response.json();
            setSavedPasswords(data);
        } catch (error) {
            console.error('Error fetching passwords:', error);
        }
    };

    const handleGenerate = () => {
        setPassword(generatePassword(length, includeLower, includeUpper, includeNumbers, includeSymbols));
    };

    const handleSave = async () => {
        if (!password || !label) return;
        try {
            const response = await fetch('https://server-z93q.onrender.com/api/passwords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password_value: password,
                    length: length,
                    has_alphabets: includeLower || includeUpper,
                    has_numbers: includeNumbers,
                    has_symbols: includeSymbols,
                    description: description,
                    label: label
                }),
            });
            const data = await response.json();
            setSavedPasswords([data, ...savedPasswords]);
            setLabel('');
            setDescription('');
        } catch (error) {
            console.error('Error saving password:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`https://server-z93q.onrender.com/api/passwords/${id}`, {
                method: 'DELETE'
            });
            setSavedPasswords(savedPasswords.filter(pw => pw.id !== id));
        } catch (error) {
            console.error('Error deleting password:', error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Password copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="generator-container">
            <h2>PASSWORD GENERATOR</h2>
            <input type="text" value={password} readOnly />
            <button className="copy-button" onClick={() => copyToClipboard(password)}>Copy</button>
            
            <div className="save-section">
                <input 
                    type="text" 
                    placeholder="Enter label" 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Enter description (optional)" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleSave}>Save Password</button>
            </div>

            <input 
                className="range-slider" 
                type="range" 
                min="4" 
                max="24" 
                value={length} 
                onChange={e => setLength(parseInt(e.target.value))} 
            />
            <span>{length}</span>
            
            <div>
                <label><input type="checkbox" checked={includeLower} onChange={() => setIncludeLower(!includeLower)} /> a-z</label>
                <label><input type="checkbox" checked={includeUpper} onChange={() => setIncludeUpper(!includeUpper)} /> A-Z</label>
                <label><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} /> 0-9</label>
                <label><input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} /> !@$#%^</label>
            </div>
            
            <button onClick={handleGenerate}>GENERATE</button>
            {copySuccess && <p className="copy-message">{copySuccess}</p>}

            <div className="saved-passwords">
                <h3>Saved Passwords</h3>
                <div className="password-list">
                    {savedPasswords.map((item) => (
                        <div key={item.id} className="password-item">
                            <div className="password-info">
                                <span className="label">{item.label}</span>
                                <span className="description">{item.description}</span>
                                <span className="password">{item.password_value}</span>
                                <span className="details">
                                    Length: {item.length} | 
                                    {item.has_alphabets ? ' ABC' : ''} 
                                    {item.has_numbers ? ' 123' : ''} 
                                    {item.has_symbols ? ' @#$' : ''}
                                </span>
                            </div>
                            <div className="password-actions">
                                <button onClick={() => copyToClipboard(item.password_value)}>Copy</button>
                                <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PasswordGenerator;
