import React from "react";
import { useEffect, useState, useCallback, useContext } from "react";
import { App, Button, Space, Table } from "antd";

import { ServiceContext } from "../contexts/ServiceContext";
import RoleEditModal from "../components/role/RoleEditModal";
import RoleMenuEditModal from "../components/role/RoleMenuEditModal";

const RolePage = () => {
    const { modal } = App.useApp();
    const { role: roleService } = useContext(ServiceContext);

    const [ roles, setRoles ] = useState([]);
    useEffect(() => {
        setRoles(roleService.getRoles());
    }, [ /* eslint-disable-line react-hooks/exhaustive-deps */ ]);

    const onEditClick = useCallback((record) => {
        setEditEntity(record);
        setEditModalOpen(true);
    }, []);

    const onEditMenuClick = useCallback((record) => {
        setEditEntity(record);
        setEditMenuModalOpen(true);
    }, []);

    const onDeleteClick = useCallback((record) => {
        modal.confirm({
            title: 'Are you sure to delete this role?',
            content: 'This action cannot be undone.',
            onOk() {
                roleService.deleteRole(record.id);
                setRoles(roleService.getRoles());
            },
        });
    }, [ /* eslint-disable-line react-hooks/exhaustive-deps */ ]);

    const [editEntity, setEditEntity] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
    const onAddBtnClick = useCallback(() => {
        setEditEntity({id: -1});
        setEditModalOpen(true);
    }, []);
    const onEditModalCreate = useCallback((values) => {
        setEditModalOpen(false);
        setEditMenuModalOpen(false);
        const role = { ...editEntity, ...values };
        if (values.id === -1) {
            roleService.addRole(role);
        } else {
            roleService.editRole(role);
        }
        setRoles(roleService.getRoles());
    }, [ editEntity /* eslint-disable-line react-hooks/exhaustive-deps */ ]);

    const onEditModalCancel = useCallback(() => {
        setEditModalOpen(false);
        setEditMenuModalOpen(false);
    }, []);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Role Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "desc", key: "desc" },
        { title: "Enable", dataIndex: "enable", key: "enable",
            render: (enable) => enable ? "True" : "False"
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => {onEditMenuClick(record)}}>Set Menu</Button> 
                    <Button type="link" onClick={() => {onEditClick(record)}}>Edit</Button>
                    {record.id !== 1 && <Button type="link" onClick={() => {onDeleteClick(record)}}>Delete</Button>}
                </Space>
            ),
        },
    ];
    
    return (
        <div className="page">
            <RoleEditModal
                open={editModalOpen}
                onCreate={onEditModalCreate}
                onCancel={onEditModalCancel}
                initialValues={editEntity}
            />
            <RoleMenuEditModal
                open={editMenuModalOpen}
                onCreate={onEditModalCreate}
                onCancel={onEditModalCancel}
                initialValues={editEntity}
            />
            <Button type="primary" onClick={onAddBtnClick}>Add Role</Button>
            <Table rowKey="id" columns={columns} dataSource={roles} />
        </div>
    );
};

export default RolePage;
