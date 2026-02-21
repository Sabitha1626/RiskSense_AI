import { useState, useRef } from 'react';
import { HiOutlineCloudUpload, HiOutlineDocument, HiOutlineTrash, HiOutlineDownload } from 'react-icons/hi';

const FileUpload = () => {
    const [files, setFiles] = useState([
        { id: 1, name: 'requirements.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'Alice', date: 'Feb 19, 2026' },
        { id: 2, name: 'wireframes.fig', size: '8.1 MB', type: 'design', uploadedBy: 'Diana', date: 'Feb 18, 2026' },
        { id: 3, name: 'api-docs.md', size: '45 KB', type: 'doc', uploadedBy: 'Bob', date: 'Feb 17, 2026' },
    ]);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = Array.from(e.dataTransfer.files);
        addFiles(dropped);
    };

    const handleSelect = (e) => {
        addFiles(Array.from(e.target.files));
    };

    const addFiles = (newFiles) => {
        const mapped = newFiles.map(f => ({
            id: Date.now() + Math.random(),
            name: f.name,
            size: formatSize(f.size),
            type: f.name.split('.').pop(),
            uploadedBy: 'You',
            date: 'Just now',
        }));
        setFiles(prev => [...mapped, ...prev]);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

    const typeIcons = { pdf: '📄', design: '🎨', doc: '📝', png: '🖼️', jpg: '🖼️', csv: '📊' };

    return (
        <div>
            {/* Drop Zone */}
            <div className={`file-drop-zone ${isDragging ? 'active' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}>
                <HiOutlineCloudUpload style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: 12 }} />
                <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>Drop files here or click to browse</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>PDF, DOC, Images, and more — up to 25MB</p>
                <input ref={inputRef} type="file" multiple hidden onChange={handleSelect} />
            </div>

            {/* File List */}
            <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 12, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                    Shared Files ({files.length})
                </h3>
                {files.map((file, idx) => (
                    <div key={file.id} className="file-item animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <span style={{ fontSize: '1.4rem' }}>{typeIcons[file.type] || '📎'}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{file.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                {file.size} • Uploaded by {file.uploadedBy} • {file.date}
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-sm" title="Download"><HiOutlineDownload /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => removeFile(file.id)} title="Remove">
                            <HiOutlineTrash style={{ color: 'var(--color-risk-high)' }} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
