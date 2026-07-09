import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './pages/(auth)/Login';
import Register from './pages/(auth)/Register';
// import ProtectedRoute from './components/ProtectedRoute';
import { getMe } from './store/slices/authSlice';
import DashboardLayout from './components/layout/DashboardLayout';
import SuperAdminDashboard from './pages/superAdmin/Dashboard';
import SchoolAdminDashboard from './pages/schoolAdmin/Dashboard';
import SchoolsList from './pages/superAdmin/SchoolsList';
import Teachers from './pages/schoolAdmin/Teachers';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getMe());
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />


       
      {/* <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}> */}
        <Route element={<DashboardLayout />}>
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/schools" element={<SchoolsList />} />
        </Route>
      {/* </Route> */}

      
      {/* <Route element={<ProtectedRoute allowedRoles={['schooladmin']} />}> */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<SchoolAdminDashboard />} />
          <Route path="/admin/teachers" element={<Teachers />} />
        </Route>
      {/* </Route> */}

      
    </Routes>
  );
}

export default App;







// import { useEffect, useRef } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import Login from './pages/(auth)/Login';
// import Register from './pages/(auth)/Register';
// import ProtectedRoute from './components/ProtectedRoute';
// import { getMe } from './store/slices/authSlice';
// import DashboardLayout from './components/layout/DashboardLayout';
// import SuperAdminDashboard from './pages/superAdmin/Dashboard';
// import SchoolAdminDashboard from './pages/schoolAdmin/Dashboard';
// import SchoolsList from './pages/superAdmin/SchoolsList';

// function App() {
//   const dispatch = useDispatch();
//   const hasFetched = useRef(false);  

//   useEffect(() => {
//     if (hasFetched.current) return;
//     hasFetched.current = true;

//     const token = localStorage.getItem('accessToken');
//     if (token) dispatch(getMe());
//   }, []);

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/" element={<Navigate to="/login" replace />} />

//       {/* Super Admin */}
//       <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
//         <Route element={<DashboardLayout />}>
//           <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
//         </Route>
//       </Route>

//       {/* School Admin */}
//       <Route element={<ProtectedRoute allowedRoles={['schooladmin']} />}>
//         <Route element={<DashboardLayout />}>
//           <Route path="/admin/dashboard" element={<SchoolAdminDashboard />} />
//         </Route>
//       </Route>
//     </Routes>
//   );
// }

// export default App;