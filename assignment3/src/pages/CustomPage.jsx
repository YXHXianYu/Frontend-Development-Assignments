import React from "react";
import { useLocation } from 'react-router-dom';
const CustomPage = () => {
  let location = useLocation();
  return (
    <div>
      <p>这是一个自定义页面</p>
      <p>path: {location.pathname}</p>
    </div>
  );
};

export default CustomPage;
