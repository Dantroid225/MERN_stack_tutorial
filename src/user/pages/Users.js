import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const {isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {  //dont use async in useEffect
    const fetchUsers = async () => {
      try {
        //const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users') //dont need to set 'get' as that is fetch default
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users') //dont need to set 'get' as that is fetch default

        setLoadedUsers(responseData.users);
      } catch (err) {

      };
      
    };
    fetchUsers();
  }, [sendRequest]);  //sendrequest as dependent important and why sendRequest is wrapped in a callback


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
        )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
