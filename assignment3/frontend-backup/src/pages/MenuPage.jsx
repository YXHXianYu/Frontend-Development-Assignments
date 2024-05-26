import React from "react";
import { useEffect, useState, useCallback, useContext } from "react";
import { Button, Space, Table, App } from "antd";

import { ServiceContext } from "../contexts/ServiceContext";
import MenuEditModal from "../components/menu/MenuEditModal";

const MenuPage = () => {
    const { modal } = App.useApp();
    const { menu: menuService } = useContext(ServiceContext);

    const [ menus, setMenus ] = useState([]);
    useEffect(() => {
        setMenus(menuService.getMenus());
    }, [ /* eslint-disable-line react-hooks/exhaustive-deps */]);

    const onEditClick = useCallback((record) => {
        setEditEntity(record);
        setEditModalOpen(true);
    }, []);

    const onDeleteClick = useCallback((record) => {
        modal.confirm({
            title: 'Are you sure to delete this menu?',
            content: 'This action cannot be undone.',
            onOk() {
                menuService.deleteMenu(record.id);
                setMenus(menuService.getMenus());
            },
        });
    }, [ /* eslint-disable-line react-hooks/exhaustive-deps */]);

    const [editEntity, setEditEntity] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const onAddBtnClick = useCallback(() => {
        setEditEntity({id: -1});
        setEditModalOpen(true);
    }, [])
    const onEditModalCreate = useCallback((values) => {
        setEditModalOpen(false);
        if (values.id === -1) {
            menuService.addMenu(values);
        } else {
            menuService.editMenu(values);
        }
        setMenus(menuService.getMenus());
    }, [ editEntity, /* eslint-disable-line react-hooks/exhaustive-deps */]);

    const onEditModalCancel = useCallback(() => {
        setEditModalOpen(false);
    }, []);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Menu Name", dataIndex: "name", key: "name" },
        { title: "Parent", dataIndex: "parent", key: "parent",
            render: (parent) => parent ? parent : "<Null>"
        },
        { title: "Path", dataIndex: "path", key: "path" },
        { title: "Enable", dataIndex: "enable", key: "enable",
            render: (enable) => enable ? "True" : "False"
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    { record.locked ? null : <>
                        <Button type="link" onClick={() => {onEditClick(record)}}>Edit</Button>
                        <Button type="link" onClick={() => {onDeleteClick(record)}}>Delete</Button>
                    </> }
                </Space>
            ),
        },
    ];
    
    return (
        <div className="page">
            <MenuEditModal
                open={editModalOpen}
                onCreate={onEditModalCreate}
                onCancel={onEditModalCancel}
                initialValues={editEntity}
            />
            <Button type="primary" onClick={onAddBtnClick}>Add Menu</Button>
            <Table rowKey="id" columns={columns} dataSource={menus} />
        </div>
    );
};

export default MenuPage;
