import React from "react"
import { useEffect, useState, useCallback, useContext } from "react"
import { Button, Space, Table, App } from "antd"

import { ServiceContext } from "../../contexts/ServiceContext"
import UserEditModal from "../UserEditModal"

const UserPage = () => {
    const { modal } = App.useApp()
    const { user: userService } = useContext(ServiceContext)

    const [ users, setUsers ] = useState([])
    const [ entity, setEntity ] = useState({})
    const [ isModalOpen, setIsModalOpen ] = useState(false)

    // initialization
    useEffect(() => {
        setUsers(userService.getUsers())
    }, [])

    // === Button ===
    const onEditClick = useCallback((record) => {
        setEntity(record)
        setIsModalOpen(true)
    }, [])

    const onDeleteClick = useCallback((record) => {
        modal.confirm({
            title: 'Are you sure to delete this user?',
            content: 'This action cannot be undone.',
            onOk() {
                userService.deleteUser(record.id)
                setUsers(userService.getUsers())
            },
        })
    }, [])

    const onAddBtnClick =    useCallback(() => {
        setEntity({id: -1})
        setIsModalOpen(true)
    }, [])
    
    // === Modal ===
    const onModalCreate = useCallback((values) => {
        setIsModalOpen(false)
        const user = { ...entity, ...values }
        if (values.id === -1) {
            userService.addUser(user)
        } else {
            userService.editUser(user)
        }
        setUsers(userService.getUsers())
    }, [])

    const onModalCancel = useCallback(() => {
        setIsModalOpen(false)
    }, [])

    const modalProps = {
        open: isModalOpen,
        onCreate: onModalCreate,
        onCancel: onModalCancel,
        initialValues: entity,
    }

    // === Table ===
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Action", key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => {onEditClick(record)}}>Edit</Button>
                    {record.id !== 1 && <Button type="link" onClick={() => {onDeleteClick(record)}}>Delete</Button>}
                </Space>
            ),
        },
    ]
    
    return (
        <div className="page">
            <UserEditModal {...modalProps} />
            <Button type="primary" onClick={onAddBtnClick}>Add User</Button>
            <Table rowKey="id" columns={columns} dataSource={users} />
        </div>
    )
}

export default UserPage
