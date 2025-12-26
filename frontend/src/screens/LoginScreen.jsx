/**
 * Login Screen Component
 * 
 * Provides user authentication interface with email and password.
 * Demonstrates modern React patterns including:
 * - React Query for server state management
 * - Redux for client state (auth persistence)
 * - React Router for navigation and redirects
 * - Proper error handling with toast notifications
 * 
 * Features:
 * - Automatic redirect if already logged in
 * - Support for redirect parameter (e.g., /login?redirect=/shipping)
 * - Loading state with spinner
 * - Form validation
 * 
 * @component
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLogin } from '../hooks';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  // Local form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // React Query mutation for login (server state)
  const { mutate: login, isPending: isLoading } = useLogin();

  // Redux selector for auth state (client state)
  const { userInfo } = useSelector((state) => state.auth);

  // Extract redirect parameter from URL
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  /**
   * Handle form submission
   * Uses React Query mutation with callbacks for success/error handling
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Call React Query mutation with inline callbacks
    login(
      { email, password },
      {
        onSuccess: (res) => {
          // Store user info in Redux for app-wide access
          dispatch(setCredentials({ ...res }));
          navigate(redirect);
        },
        onError: (err) => {
          // Display user-friendly error message
          toast.error(err?.response?.data?.detail || err.message);
        },
      }
    );
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary'>
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
