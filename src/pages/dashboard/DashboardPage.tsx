import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout';
import { HiOutlineUsers, HiOutlineShoppingBag, HiOutlineUserCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import $api from '../../api/api';
import type { User, Product } from '../../types';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          $api.users.getAllUsers(),
          $api.products.getAll(),
        ]);
        
        const users: User[] = usersRes.data;
        const products: Product[] = productsRes.data;

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          totalProducts: products.length,
          admins: users.filter(u => u.role === 'admin').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Header title={t('dashboard.title')} />
      <div className="page-scroll-container">
        <div className="page-header">
          <h1>{t('dashboard.overview')}</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-card-icon-wrapper blue">
                  <HiOutlineUsers className="w-6 h-6" />
                </div>
                <div className="stat-card-content">
                  <p className="stat-card-label">{t('dashboard.totalUsers')}</p>
                  <p className="stat-card-value">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-card-icon-wrapper green">
                  <HiOutlineCheckCircle className="w-6 h-6" />
                </div>
                <div className="stat-card-content">
                  <p className="stat-card-label">{t('dashboard.activeUsers')}</p>
                  <p className="stat-card-value">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-card-icon-wrapper purple">
                  <HiOutlineShoppingBag className="w-6 h-6" />
                </div>
                <div className="stat-card-content">
                  <p className="stat-card-label">{t('dashboard.products')}</p>
                  <p className="stat-card-value">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-card-icon-wrapper orange">
                  <HiOutlineUserCircle className="w-6 h-6" />
                </div>
                <div className="stat-card-content">
                  <p className="stat-card-label">{t('dashboard.admins')}</p>
                  <p className="stat-card-value">{stats.admins}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
