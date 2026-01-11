import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const Signup = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '', address: '' },
        validationSchema: Yup.object({
            name: Yup.string().min(20, 'Min 20 characters').max(60).required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            address: Yup.string().max(400).required('Required'),
            password: Yup.string()
                .min(8).max(16)
                .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])/, "1 Upper, 1 Special char")
                .required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await register(values);
                navigate('/login');
            } catch (err) {
                setError(err.response?.data?.message || 'Signup Failed');
            }
        },
    });

    return (
        <div className="container mt-5">
            <div className="card mx-auto shadow" style={{ maxWidth: '500px' }}>
                <div className="card-header bg-primary text-white text-center">
                    <h3>Sign Up</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                {...formik.getFieldProps('name')} />
                            <div className="invalid-feedback">{formik.errors.name}</div>
                            <small className="text-muted">Must be 20-60 characters</small>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                {...formik.getFieldProps('email')} />
                            <div className="invalid-feedback">{formik.errors.email}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <textarea className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                                {...formik.getFieldProps('address')} />
                            <div className="invalid-feedback">{formik.errors.address}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                {...formik.getFieldProps('password')} />
                            <div className="invalid-feedback">{formik.errors.password}</div>
                            <small className="text-muted">8-16 chars, 1 Uppercase, 1 Special</small>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/login">Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;