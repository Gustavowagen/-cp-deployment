import { useEffect, useState } from 'react';
import BrandOne from '../images/brand/brand-01.svg';
import BrandTwo from '../images/brand/brand-02.svg';
import BrandThree from '../images/brand/brand-03.svg';
import BrandFour from '../images/brand/brand-04.svg';
import BrandFive from '../images/brand/brand-05.svg';
import "./Requests.css";
import Button from '@mui/material/Button';
import InfiniteScroll from 'react-infinite-scroll-component';


const RequestDashboard = (props) => {

    const [allowedAccess, setAllowedAccess] = useState(false);
    const [requests, setRequests] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchSelf = async () => {
      if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${props.API_URL}/api/user/self`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (data.role === "ADMIN") {
                setAllowedAccess(true);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
      if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${props.API_URL}/api/lim-requests?page=${page}&size=10`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (data.requests.length <= 0) { // Kan ikke bruke totalResults siden den er constant
                setHasMore(false);
            }
            setRequests(prevRequests => {
                // Create a new array that combines the current and new requests,
                // but removes any duplicates based on the `id` field.
                const combinedRequests = [...prevRequests, ...data.requests];
                const uniqueRequests = combinedRequests.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                );
                return uniqueRequests;
            });
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {fetchSelf()}, []);

    useEffect(() => {
        fetchRequests();
    }, [page]);

    const acceptRequest = async (id) => {
        try {
            const response = await fetch(`${props.API_URL}/api/request/accept?id=${id}`, {
                method:"DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await response.json();
            setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error(error.message, "skyldes mest sannsynlig at det finnes en user med det usernamet allerede");
        }
    }

    const denyRequest = async (id) => {
        try {
            const response = await fetch(`${props.API_URL}/api/request/deny?id=${id}`, {
                method:"DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error(error.message);
        }
    }

    const loadMoreData = () => {
        console.log("called");
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    }

    return (
        <>
        {allowedAccess ? (
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1" id="abcd">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Request Dashboard
          </h4>
          <div id="request-scroll-container" className="request-scroll-container">
            <InfiniteScroll
              dataLength={requests.length}
              next={loadMoreData}
              hasMore={hasMore}
              scrollableTarget="request-scroll-container"
            >
              <div className="flex flex-col">
                <div className="request-grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                  <div className="p-2.5 xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      Type
                    </h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      Created at
                    </h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      Request info
                    </h5>
                  </div>
                  <div className="hidden p-2.5 text-center sm:block xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                      Accept
                    </h5>
                  </div>
                </div>
                
                {requests.map((request, key) => (
                  <div
                    className={`request-grid grid-cols-3 sm:grid-cols-5 ${
                      key === requests.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                    }`}
                    key={key}
                  >
                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                      <p className="hidden text-black dark:text-white sm:block">
                        {request.requestType.toLowerCase()}
                      </p>
                    </div>
      
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-black dark:text-white" style={{ marginLeft: "20px" }}>
                        {request.createdAt}
                      </p>
                    </div>
      
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-meta-3">
                        {request?.registerRequest?.username}
                        <br />
                        {request?.registerRequest?.email}
                        <br />
                        {request?.registerRequest?.phone}

                        {request?.sender?.username}
                        <br />
                        {request?.siteRequest?.name}
                        <br />
                        <a href={request?.siteRequest?.url} target="_blank">
                          {request?.siteRequest?.url}
                        </a>
                      </p>
                    </div>
      
                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: "15px" }}
                        onClick={() => acceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => denyRequest(request.id)}>
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
        ): <div>Du har ikke tilgang til dette stedet</div>}
        
        </>
      );
};

export default RequestDashboard;
