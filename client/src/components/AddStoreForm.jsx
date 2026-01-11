import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';

const AddStoreForm = ({ onSuccess }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            address: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Store Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            address: Yup.string().max(400, "Max 400 chars").required("Address is required")
        }),
        onSubmit: async (values) => {
            try {
                await api.post('/stores', values);
                alert("Store Created Successfully!");
                formik.resetForm();
                if (onSuccess) onSuccess();
            } catch (err) {
                alert(err.response?.data?.message || "Failed to create store");
            }
        }
    });

    return (
        <div style={{ maxWidth: '400px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Add New Store</h3>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Store Name</label>
                    <input
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {formik.errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.name}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Store Email</label>
                    <input
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {formik.errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
                    <textarea
                        name="address"
                        rows="3"
                        onChange={formik.handleChange}
                        value={formik.values.address}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {formik.errors.address && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.address}</div>}
                </div>

                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Create Store</button>
            </form>
        </div>
    );
};

export default AddStoreForm;