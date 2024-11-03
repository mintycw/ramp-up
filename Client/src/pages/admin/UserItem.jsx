import React, { useState } from "react";
import apiService from "../../logic/apiService";
import img from "../../assets/images/profilepicture.jpg";
import { useNavigate } from "react-router-dom";
import { useGetDataQuery } from "../../logic/apiSlice";

function UserItem({ data, permissions }) {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [permissionID, setPermissionID] = useState(data.permissionID);
    const [verified, setVerified] = useState(data.verified);
    const { data: accountData, isSuccess } = useGetDataQuery("/account/user");

    async function handlePermissionChange(permission) {
        setPermissionID(parseInt(permission));

        await apiService.put('/admin/users/permission', {
            accountID: data.accountID,
            permissionID: parseInt(permission)
        }).then((res) => {
            if (res.success)
                setSuccess(true);
        });
    }

    async function handleVerifiedChange() {
        const newVerifiedStatus = !verified;
        setVerified(newVerifiedStatus);

        await apiService.put('/admin/users/verified', {
            accountID: data.accountID
        }).then((res) => {
            if (res.success) 
                setVerified(res.verified);
        });
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b w-full max-w-3xl mx-auto">
            
            {/* Account Info */}
            <div className="flex items-center gap-4">
                <img src={img} className="w-12 h-12 rounded-full object-cover" alt="Profile" />
                <div className="flex flex-col justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <h5 className="text-base font-bold hover:underline cursor-pointer" onClick={() => navigate(`/profile/${data.accountID}/posts`)}>
                            @{data.username}
                        </h5>
                        {isSuccess && accountData.accountID === data.accountID && (
                            <>
                                <span className="text-sm">&#8226;</span>
                                <span className="text-sm">you</span>
                            </>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">{data.name}</p>
                </div>
            </div>

            {/* Actions: Slider Toggle and Dropdown */}
            <div className="flex flex-row justify-between gap-4 items-center">
                {/* Slider Toggle for verified status */}
                <label className="flex items-center text-sm cursor-pointer select-none">
                    <div
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 border-dark-primary border flex-shrink-0 flex items-center ${
                            verified ? 'bg-dark-bg' : 'bg-gray-500'
                        }`}
                        onClick={handleVerifiedChange}
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                                verified ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                        />
                    </div>
                    <span className="ml-3">Verified</span>
                </label>

                {/* Select dropdown for permissions */}
                <select
                    value={permissionID}
                    onChange={(e) => handlePermissionChange(e.target.value)}
                    className={`bg-dark-bg border-dark-primary border rounded-md px-2 py-1 text-sm focus:outline-none focus:border-blue-500 transition ${
                        success ? 'border-green-500' : ''
                    }`}
                >
                    <option value={undefined} defaultValue disabled>
                        Permissions
                    </option>
                    {permissions.map((permission) => (
                        <option key={permission.permissionID} value={permission.permissionID}>
                            {permission.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default UserItem;
