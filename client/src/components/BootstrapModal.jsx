const BootstrapModal = ({ show, title, onClose, onConfirm, confirmText = "Confirm", children, confirmColor = "primary" }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        {onConfirm && (
                            <button type="button" className={`btn btn-${confirmColor}`} onClick={onConfirm}>
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BootstrapModal;