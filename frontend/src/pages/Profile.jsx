import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="px-margin-page py-section-gap max-w-container-max mx-auto text-center">Loading profile...</div>;
  }

  return (
    <main className="px-margin-page py-section-gap max-w-container-max mx-auto">
      <div className="glass-card p-12 rounded-[56px] inner-glow max-w-4xl mx-auto">
        <h1 className="font-display-xl text-h1 mb-6">Account Profile</h1>
        <div className="space-y-4 text-on-surface-variant">
          <div>
            <h2 className="font-bold text-lg">Name</h2>
            <p>{user.name}</p>
          </div>
          <div>
            <h2 className="font-bold text-lg">Email</h2>
            <p>{user.email}</p>
          </div>
          <div>
            <h2 className="font-bold text-lg">Role</h2>
            <p>{user.role}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/wishlist" className="bg-primary text-on-primary px-6 py-3 rounded-full font-semibold primary-glow hover:scale-105 transition-all">
            View Wishlist
          </Link>
          <Link to="/orders" className="border-[1.5px] border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary/5 transition-all">
            Order History
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Profile;
