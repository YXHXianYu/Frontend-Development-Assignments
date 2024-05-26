import { useEffect, useContext } from 'react';
import { App } from "antd";
import { ServiceContext } from '../contexts/ServiceContext';
import { useNavigate } from 'react-router-dom';

const useLoginCheck = () => {
  const { user: userService } = useContext(ServiceContext);
  const { message } = App.useApp();
  const navigate = useNavigate();


  useEffect(() => {
    const user = userService.getCurrentUser();
    if (!user) {
      message.open(
        {
          type: "warning",
          content: "请先登录",
        }
      );
      navigate("/login");
    }
  }, [/* eslint-disable-line react-hooks/exhaustive-deps */]);
};

export default useLoginCheck;