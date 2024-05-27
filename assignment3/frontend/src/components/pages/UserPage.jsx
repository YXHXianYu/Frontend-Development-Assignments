import React from "react"
import { useEffect, useState, useCallback, useContext } from "react"
import { Button, Space, Table, App } from "antd"

import { ServiceContext } from "../../contexts/ServiceContext"
import UserEditModal from "../user/UserEditModal"
import UserRoleEditModal from "../user/UserRoleEditModal"

const UserPage = () => {
    const { modal } = App.useApp()
    const { user: userService } = useContext(ServiceContext)

    const [ users, setUsers ] = useState([])
    useEffect(() => {
        setUsers(userService.getUsers())
    }, [/* eslint-disable-line react-hooks/exhaustive-deps */])
    
    const onRoleClick = useCallback((record) => {
        setEditEntity(record)
        setRoleEditModalOpen(true)
    }, [])

    const onEditClick = useCallback((record) => {
        setEditEntity(record)
        setEditModalOpen(true)
    }, [])

    const onDeleteClick = useCallback((record) => {
        modal.confirm({
            title: 'Are you sure to delete this user?',
            content: 'This action cannot be undone.',
            onOk() {
                userService.deleteMenu(record.id)
                setUsers(userService.getUsers())
            },
        })
    }, [/* eslint-disable-line react-hooks/exhaustive-deps */])

    const [editEntity, setEditEntity] = useState({})
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editRoleModalOpen, setRoleEditModalOpen] = useState(false)
    const onAddBtnClick =    useCallback(() => {
        setEditEntity({id: -1})
        setEditModalOpen(true)
    }, [])
    const onEditModalCreate = useCallback((values) => {
        setEditModalOpen(false)
        setRoleEditModalOpen(false)
        const user = { ...editEntity, ...values }
        if (values.id === -1) {
            userService.addUser(user)
        } else {
            userService.editUser(user)
        }
        setUsers(userService.getUsers())
    }, [ editEntity, /* eslint-disable-line react-hooks/exhaustive-deps */])

    const onEditModalCancel = useCallback(() => {
        setEditModalOpen(false)
        setRoleEditModalOpen(false)
    }, [])

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Enable", dataIndex: "enable", key: "enable",
            render: (enable) => enable ? "True" : "False"
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => {onRoleClick(record)}}>Set Role</Button>
                    <Button type="link" onClick={() => {onEditClick(record)}}>Edit</Button>
                    {record.id !== 1 && <Button type="link" onClick={() => {onDeleteClick(record)}}>Delete</Button>}
                </Space>
            ),
        },
    ]
    
    return (
        <div className="page">
            <UserEditModal
                open={editModalOpen}
                onCreate={onEditModalCreate}
                onCancel={onEditModalCancel}
                initialValues={editEntity}
            />
            <UserRoleEditModal
                open={editRoleModalOpen}
                onCreate={onEditModalCreate}
                Delete={onEditModalCancel}
                initialValues={editEntity} 
            />
            <Button type="primary" onClick={onAddBtnClick}>Add User</Button>
            <Table rowKey="id" columns={columns} dataSource={users} />
        </div>
    )
}

export default UserPage
