import type React from "react";

import { useState } from "react";
import { Modal, Form, Input, Button, Typography, Alert } from "antd";
import admin from "../database/admin.json";
import { useAuthStore } from "@/store/authStore";

const { Title, Text } = Typography;

const LoginModal: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);

  const handleFinish = async (values: { password: string }) => {
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (values.password !== admin.password) {
      setError("Incorrect password");
      setIsLoading(false);
      return;
    }

    login();
    setIsLoading(false);
  };

  return (
    <Modal
      open={!isLoggedIn}
      footer={null}
      closable={false}
      centered
      width={360}
    >
      <div className="text-center mb-6">
        <Title level={3} className="mb-1">
          🐺 Werewolf
        </Title>
        <Text type="secondary">For game master only</Text>
      </div>

      <Form layout="vertical" onFinish={handleFinish} autoComplete="off">
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password
            placeholder="Enter password"
            onFocus={() => setError("")}
          />
        </Form.Item>

        {error && (
          <Alert
            type="error"
            title={error}
            showIcon
            className="mb-4"
          />
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
