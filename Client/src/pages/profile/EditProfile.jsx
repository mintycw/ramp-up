import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import img from "../../assets/images/profilepicture.jpg";
import { updateTitle } from "../../app/redux-reducers/contextProvider";
import apiService from "../../logic/apiService";
import { useDispatch } from "react-redux";
import { useGetDataQuery } from "../../logic/apiSlice";

function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [account, setAccount] = useState({});

    const {
        data: accountData,
        isSuccess,
        isLoading,
    } = useGetDataQuery("/account/user");

    useEffect(() => {
        dispatch(updateTitle("Edit profile"));

        apiService.get(`/account/own`).then((res) => {
            setAccount(res.result);
        });
    }, []);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setAccount(prevAccount => ({
            ...prevAccount,
            [name]: value,
        }));
    }

    function saveProfile() {
        apiService.put('/account/own', {
            accountID: accountData.accountID,
            account
        }).then((res) => {
            
            if (!res.success) {
                alert(res.message);
                return
            }

            navigate(`/profile/${accountData.accountID}`);
        });
    }

    if (isLoading || Object.keys(account).length <= 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="mt-10 flex flex-col items-center justify-center text-sm w-full max-w-screen-lg">
            {/* Profile grid container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 w-full md:w-4/5">
                {/* Column 1: Profile picture */}
                <div className="relative flex justify-center md:justify-center">
                    <button className="relative">
                        <img
                            className="h-20 w-20 md:h-32 md:w-32 rounded-full object-cover object-center"
                            src={img}
                            alt="Profile"
                        />
                        <span className="absolute md:bottom-4 right-0 bg-dark-secondary p-2 rounded-full">
                            <FaPencilAlt className="text-white" />
                        </span>
                    </button>
                </div>

                {/* Column 2: Name and Username fields */}
                <div className="flex flex-col justify-center md:col-span-1 gap-3">
                    {/* Username field */}
                    <div>
                        <h5 className="font-extrabold">Username</h5>
                        <p className="text-dark-secondary">@{account?.username || "N/A"}</p>
                    </div>

                    {/* Email field */}
                    <div>
                        <h5 className="font-extrabold">Email</h5>
                        <p className="text-dark-secondary">{account?.email || "N/A"}</p>
                    </div>

                    {/* Name field */}
                    <div>
                        <h5 className="font-extrabold">Name</h5>
                        <input
                            name="name"
                            className="focus:border-dark-secondary bg-dark-bg border-dark-primary rounded border p-2 outline-none w-full"
                            type="text"
                            inputMode="text"
                            placeholder="Enter your name"
                            value={account?.name || ""}
                            onChange={handleInputChange}
                            maxLength={20}
                        />
                    </div>
                </div>

                {/* Full width row: Bio */}
                <div className="col-span-1 md:col-span-2">
                    <h5 className="font-extrabold">Bio</h5>
                    <textarea
                        name="description"
                        className="focus:border-dark-secondary bg-dark-bg border-dark-primary rounded border p-2 outline-none w-full h-24"
                        placeholder="Enter your bio"
                        value={account.description || ""}
                        onChange={handleInputChange}
                        maxLength={255}
                    />
                </div>

                <div className="md:col-span-2 flex justify-between md:justify-end gap-8">
                    <button
                        onClick={() => navigate(`/profile/${accountData.accountID}`)}
                        className="border-dark-secondary text-dark-secondary flex h-6 w-16 items-center justify-center rounded border font-bold">
                        Cancel
                    </button>
                    <button
                        onClick={saveProfile}
                        type="submit"
                        className="bg-dark-secondary text-dark-text h-6 w-16 rounded font-bold">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
