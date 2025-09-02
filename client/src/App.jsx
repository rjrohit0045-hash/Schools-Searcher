import React, { useState, useEffect, useCallback } from 'react';

// --- CSS Styles (No changes here) ---
const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; color: #333; }
    .app-container { min-height: 100%; width: 100%; display: flex; flex-direction: column; }
    .header { background: linear-gradient(90deg, #4f46e5, #3b82f6); color: white; padding: 20px 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; justify-content: space-between; align-items: center; }
    .header-title { font-size: 1.75rem; font-weight: 700; }
    .header-icon { width: 32px; height: 32px; }
    .main-content { max-width: 1200px; margin: 0 auto; padding: 32px; flex-grow: 1; width: 100%; }
    .navigation { display: flex; justify-content: center; align-items: center; background-color: white; padding: 12px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto; }
    .nav-button { padding: 8px 24px; border: none; border-radius: 9999px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; background-color: transparent; color: #4b5563; }
    .nav-button.active { background-color: #4f46e5; color: white; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    .nav-button:not(.active):hover { background-color: #e5e7eb; }
    .add-school-form-container { background-color: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 800px; margin: auto; }
    .add-school-form-container h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } .form-grid-full-width { grid-column: span 2; } }
    .input-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px; }
    .input-field { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; transition: border-color 0.2s, box-shadow 0.2s; }
    .input-field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3); }
    .input-field.error { border-color: #ef4444; }
    .input-field.error:focus { box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3); }
    .error-text { color: #ef4444; font-size: 0.75rem; margin-top: 4px; }
    .form-footer { margin-top: 32px; display: flex; justify-content: flex-end; align-items: center; }
    .submit-button { padding: 12px 32px; background: linear-gradient(90deg, #4f46e5, #3b82f6); color: white; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .submit-button:hover { opacity: 0.9; }
    .submit-button:disabled { opacity: 0.5; cursor: not-allowed; }
    .submit-message { margin-right: 16px; font-size: 0.875rem; }
    .schools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }
    .school-card { background-color: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .school-card:hover { transform: translateY(-8px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
    .school-card-image-container { height: 180px; overflow: hidden; background-color: #e5e7eb; }
    .school-card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .school-card:hover .school-card-image { transform: scale(1.05); }
    .school-card-content { padding: 20px; }
    .school-card h3 { font-size: 1.125rem; font-weight: 600; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .school-card p { font-size: 0.875rem; color: #6b7280; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .status-message { text-align: center; padding: 40px; font-size: 1rem; color: #4b5563; }
`;

const StyleInjector = () => {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = cssStyles;
        document.head.appendChild(styleElement);
        return () => { document.head.removeChild(styleElement); };
    }, []);
    return null;
};

const API_URL = 'http://localhost:4000'; // Hamara backend server yahan chalega

export default function App() {
    const [page, setPage] = useState('show');
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSchools = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/schools`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSchools(data);
        } catch (err) {
            setError('Failed to fetch schools. Make sure the backend server is running.');
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (page === 'show') {
            fetchSchools();
        }
    }, [page, fetchSchools]);

    return (
        <>
            <StyleInjector />
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Navigation currentPage={page} setPage={setPage} />
                    {page === 'add' && <AddSchoolPage onSchoolAdded={fetchSchools} setPage={setPage} />}
                    {page === 'show' && <ShowSchoolsPage schools={schools} isLoading={isLoading} error={error} />}
                </main>
            </div>
        </>
    );
}

function Header() {
    return (
        <header className="header">
            <h1 className="header-title">School Directory</h1>
            <svg xmlns="http://www.w3.org/2000/svg" className="header-icon" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
        </header>
    );
}

function Navigation({ currentPage, setPage }) {
    return (
        <nav className="navigation">
            <button onClick={() => setPage('show')} className={`nav-button ${currentPage === 'show' ? 'active' : ''}`}>Show Schools</button>
            <button onClick={() => setPage('add')} className={`nav-button ${currentPage === 'add' ? 'active' : ''}`}>Add School</button>
        </nav>
    );
}

const InputField = React.memo(({ name, label, placeholder, value, onChange, error }) => (
    <div className="input-group">
        <label htmlFor={name}>{label}</label>
        <input type="text" name={name} id={name} placeholder={placeholder} value={value} onChange={onChange} className={`input-field ${error ? 'error' : ''}`} />
        {error && <p className="error-text">{error}</p>}
    </div>
));

function AddSchoolPage({ onSchoolAdded, setPage }) {
    const initialFormState = { name: '', address: '', city: '', state: '', contact: '', image: '', email_id: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "School name is required.";
        if (!formData.address) tempErrors.address = "Address is required.";
        if (!formData.city) tempErrors.city = "City is required.";
        if (!formData.state) tempErrors.state = "State is required.";
        if (!formData.email_id) {
            tempErrors.email_id = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
            tempErrors.email_id = "Email is not valid.";
        }
        if (!formData.contact) {
            tempErrors.contact = "Contact number is required.";
        } else if (!/^\d{10,15}$/.test(formData.contact)) {
            tempErrors.contact = "Contact must be between 10 and 15 digits.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            setSubmitMessage('');
            try {
                const response = await fetch(`${API_URL}/api/schools`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    throw new Error('Failed to add school');
                }
                setSubmitMessage("School added successfully!");
                onSchoolAdded();
                setTimeout(() => { setPage('show'); }, 1500);
            } catch (error) {
                console.error("Error adding document:", error);
                setSubmitMessage("Failed to add school. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="add-school-form-container">
            <h2>Add New School Information</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <InputField name="name" label="School Name" placeholder="e.g., Delhi Public School" value={formData.name} onChange={handleChange} error={errors.name} />
                    <InputField name="address" label="Address" placeholder="e.g., Sector-24" value={formData.address} onChange={handleChange} error={errors.address} />
                    <InputField name="city" label="City" placeholder="e.g., Noida" value={formData.city} onChange={handleChange} error={errors.city} />
                    <InputField name="state" label="State" placeholder="e.g., Uttar Pradesh" value={formData.state} onChange={handleChange} error={errors.state} />
                    <InputField name="contact" label="Contact Number" placeholder="10-digit mobile number" value={formData.contact} onChange={handleChange} error={errors.contact} />
                    <InputField name="email_id" label="Email ID" placeholder="e.g., contact@dps.com" value={formData.email_id} onChange={handleChange} error={errors.email_id} />
                    <div className="form-grid-full-width">
                        <InputField name="image" label="Image URL" placeholder="https://example.com/school.jpg" value={formData.image} onChange={handleChange} error={errors.image} />
                    </div>
                </div>
                <div className="form-footer">
                    {submitMessage && <p className="submit-message" style={{ color: submitMessage.includes('successfully') ? 'green' : 'red' }}>{submitMessage}</p>}
                    <button type="submit" disabled={isSubmitting} className="submit-button">{isSubmitting ? 'Submitting...' : 'Add School'}</button>
                </div>
            </form>
        </div>
    );
}

function ShowSchoolsPage({ schools, isLoading, error }) {
    if (isLoading) return <div className="status-message">Loading schools from your database...</div>;
    if (error) return <div className="status-message" style={{ color: 'red' }}>{error}</div>;
    if (schools.length === 0) return <div className="status-message">No schools found. Add a new school to see it here!</div>;

    return (
        <div className="schools-grid">
            {schools.map(school => <SchoolCard key={school.id} school={school} />)}
        </div>
    );
}

function SchoolCard({ school }) {
    const placeholderImage = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(school.name)}`;
    return (
        <div className="school-card">
            <div className="school-card-image-container">
                <img src={school.image || placeholderImage} alt={`Image of ${school.name}`} onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} className="school-card-image" />
            </div>
            <div className="school-card-content">
                <h3 title={school.name}>{school.name}</h3>
                <p title={school.address}>{school.address}</p>
                <p title={school.city}>{school.city}, {school.state}</p>
            </div>
        </div>
    );
}

