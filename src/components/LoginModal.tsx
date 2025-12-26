import type React from "react";

import { useState } from "react";
import { Modal, Form, Input, Button, Typography } from "antd";
import admin from "../database/admin.json";
import { useAuthStore } from "@/store/authStore";

const { Title, Text } = Typography;

const LoginModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);

  const handleFinish = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

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
          rules={[
            { required: true, message: "Please enter password" },
            {
              validator: (_, value) =>
                value && value === admin.password
                  ? Promise.resolve()
                  : Promise.reject(new Error("Passwords do not match")),
            },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

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
