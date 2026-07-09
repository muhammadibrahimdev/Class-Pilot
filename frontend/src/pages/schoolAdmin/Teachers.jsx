    // pages/Teachers.jsx
    import { useMemo, useState } from 'react';
    import { Icons } from '../../config/icon';
    import Badge from '../../components/ui/Badge';
    import IconButton from '../../components/ui/IconButton';
    import Modal from '../../components/ui/Modal';
    import AddTeacherForm from '../../components/forms/AddTeacherForm';
    import DataTable from '../../components/ui/DataTable';
    import Avatar from '../../components/ui/Avatar';
    import { useTeachers } from '../../hooks/useTeachers';
    import { useDebounce } from '../../hooks/useDebounce';


    const DUMMY_TEACHERS = [
        { id: 1, name: 'Dr. Sarah Ahmed', email: 'sarah@school.edu', phone: '+92 300 1111111', assignedClass: 'Grade 10-A', subject: 'Mathematics', status: 'active' },
        { id: 2, name: 'Mr. Ali Khan', email: 'ali@school.edu', phone: '+92 300 2222222', assignedClass: 'Grade 9-B', subject: 'Physics', status: 'active' },
        { id: 3, name: 'Ms. Fatima Malik', email: 'fatima@school.edu', phone: '+92 300 3333333', assignedClass: 'Grade 11-A', subject: 'Chemistry', status: 'active' },
        { id: 4, name: 'Mr. Usman Raza', email: 'usman@school.edu', phone: '+92 300 4444444', assignedClass: 'Grade 9-A', subject: 'English', status: 'inactive' },
        { id: 5, name: 'Ms. Ayesha Tariq', email: 'ayesha@school.edu', phone: '+92 300 5555555', assignedClass: 'Grade 10-B', subject: 'Biology', status: 'active' },
    ];



    export default function Teachers() {
        const [searchInput, setSearchInput] = useState('');
        const search = useDebounce(searchInput, 400);
        // const search = searchInput;
        const [page, setPage] = useState(1);
        const [sortKey, setSortKey] = useState('name');
        const [sortDir, setSortDir] = useState('asc');
        const [addModal, setAddModal] = useState(false);


        const { data, total, totalPages, loading, error, refetch } = useTeachers({
            page, limit: 10, sortKey, sortDir, search,
        })

        const columns = useMemo(() => [
            {
                key: 'name',
                label: 'Teacher',
                render: (t) => (
                    <div className="flex items-center gap-3">
                        <Avatar name={t.name} />
                        <span className="font-medium text-ink">{t.name}</span>
                    </div>
                ),
            },
            { key: 'email', label: 'Email', render: (t) => <span className="text-muted">{t.email}</span> },
            { key: 'phone', label: 'Phone', render: (t) => <span className="text-muted">{t.phone}</span> },
            { key: 'assignedClass', label: 'Class', render: (t) => <span className="text-ink font-medium">{t.assignedClass}</span> },
            { key: 'subject', label: 'Subject', render: (t) => <span className="text-muted">{t.subject}</span> },
            {
                key: 'status',
                label: 'Status',
                render: (t) => <Badge label={t.status} variant={t.status === 'active' ? 'approved' : 'rejected'} />,
            },
            {
                key: 'actions',
                label: 'Actions',
                render: (t) => (
                    <div className="flex items-center gap-1">
                        <IconButton icon={Icons.edit} variant="default" title="Edit teacher" onClick={() => console.log('edit', t.id)} />
                        <IconButton icon={Icons.delete} variant="danger" title="Delete teacher" onClick={() => console.log('delete', t.id)} />
                    </div>
                ),
            },
        ], [])


        return (
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-ink tracking-tight">Teachers</h1>
                        <p className="text-muted text-sm mt-0.5">Manage all teaching staff in your school.</p>
                    </div>
                    <button
                        onClick={() => setAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
                    >
                        <Icons.plus size={15} />
                        Add Teacher
                    </button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <DataTable
                    columns={columns}
                    data={data}
                    total={total}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSortChange={(key, dir) => { setSortKey(key); setSortDir(dir); setPage(1); }}
                    search={searchInput}
                    onSearchChange={(val) => { setSearchInput(val); setPage(1); }}
                    searchPlaceholder="Search by name, email, subject..."
                    loading={loading}
                    itemLabel="teacher"
                    rowKey={(t) => t.id}
                />


                <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Teacher">
                    <AddTeacherForm onClose={() => setAddModal(false)} refetch={refetch} />
                </Modal>
            </div>
        );
    }