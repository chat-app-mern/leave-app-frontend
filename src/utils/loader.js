import Cookies from 'js-cookie';
import { redirect } from 'react-router-dom';

export function employeeloader() {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (!token && !role) {
        return redirect('/login');
    }
    if (token && role) {
        if (role === 'admin') {
            return redirect('/admin');
        }
    }
    if (token && role) {
        if (role === 'manager') {
            return redirect('/manager');
        }
    }
}

export function adminloader() {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (!token && !role) {
        return redirect('/login');
    }
    if (token && role) {
        if (role === 'employee') {
            return redirect('/');
        }
    }
    if (token && role) {
        if (role === 'manager') {
            return redirect('/manager');
        }
    }
}

export function managerloader() {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (!token && !role) {
        return redirect('/login');
    }
    if (token && role) {
        if (role === 'employee') {
            return redirect('/');
        }
    }
    if (token && role) {
        if (role === 'admin') {
            return redirect('/admin');
        }
    }
}

export function loader() {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (token && role) {
        if (role === 'admin') {
            return redirect('/admin');
        }
        if (role === 'employee') {
            return redirect('/');
        }
        if (role === 'manager') {
            return redirect('/manager');
        }
    }
}
