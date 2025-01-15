import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Layout, Col, Row } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.ts";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Manejar login con correo y contraseña
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("¡Bienvenido al sistema!");
      window.location.href = "/panel";
    } catch (error) {
      message.error("Credenciales incorrectas. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar login con Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      message.success("¡Bienvenido con Google!");
      window.location.href = "/panel";
    } catch (error) {
      message.error("Error al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      className="login-container"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Fondo Azul Oscuro */}
      <Col
        className="login-image"
        style={{
          flex: 1,
          backgroundColor: '#001d3d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <div className="text-white text-center">
          <Title level={3} style={{ color: 'white', fontWeight: 600 }}>
            Debes iniciar sesión para continuar
          </Title>
        </div>
      </Col>

      {/* Formulario de inicio de sesión */}
      <Col
        className="login-form-container"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 700 }}>
            Iniciar Sesión
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', marginBottom: '24px' }} type="secondary">
            Introduzca sus credenciales para continuar.
          </Text>

          {/* Formulario de correo y contraseña */}
          <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor ingrese su correo' },
                { type: 'email', message: 'Ingrese un correo válido' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#001d3d' }} />}
                placeholder="Correo electrónico"
                size="large"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  padding: '12px',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#001d3d' }} />}
                placeholder="Contraseña"
                size="large"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  padding: '12px',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  backgroundColor: '#001d3d',
                  border: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>

          {/* Opción de iniciar sesión con Google */}
          <Row justify="center" style={{ marginTop: '16px' }}>
            <Button
              type="default"
              size="large"
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '8px',
                fontWeight: 600,
                border: '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
              }}
            >
              Iniciar sesión con Google
            </Button>
          </Row>
        </div>
      </Col>
    </Layout>
  );
};

export default LoginPage;
