import React, { useEffect } from "react";
import styles from "./Favourites.module.scss";
import classNames from "classnames/bind";
import Header from "../../layouts/Header/Header";
import Footer from "../../layouts/Footer/Footer";
import AuthUser from "../../utils/AuthUser";
import { useState } from "react";
import { Divider } from 'antd'
import BookingCard from "../../components/BookingCard/BookingCard";
import { ref, getDownloadURL } from "firebase/storage"
import { storage } from '../../utils/firebase'
import Loading from '../../components/Loading/Loading';
import { useSelector } from "react-redux";
import { favouritesRoomsSelector, favouritesServicesSelector } from "../../redux/selectors";

const cx = classNames.bind(styles);

function Favourites() {
  const { user } = AuthUser();

  const [toggleState, setToggleState] = useState(1);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Create a reference from a Google Cloud Storage URI
  const avatarRef = ref(storage, user.avatar);

  const favouritesRooms = useSelector(favouritesRoomsSelector);
  const favouritesServices = useSelector(favouritesServicesSelector);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  useEffect(() => {
    getDownloadURL(avatarRef).then(url => {
      setAvatarUrl(url);
      setLoading(true);
    })
  }, [])

  if (!loading) {
    return (
      <Loading />
    )
  } else {
    return (
      <div>
        <Header userInfo={user} imageUrl={avatarUrl} />
        <div className={cx("body")}>
          <h1>List Favourites</h1>
          <div className={cx("container")}>
            <div className={cx("bloc-tabs")}>
              <button
                className={
                  toggleState === 1
                    ? cx("tabs__active")
                    : cx("tabs")
                }
                onClick={() => toggleTab(1)}
              >
                <div>
                  <h4 className={cx("label-tabs")}>Room</h4>
                  <div>{favouritesRooms.length} mark</div>
                </div>
              </button>

              <Divider className={cx("seperate-line")} type="vertical" />

              <button
                className={
                  toggleState === 2
                    ? cx("tabs__active")
                    : cx("tabs")
                }
                onClick={() => toggleTab(2)}
              >
                <div>
                  <h4 className={cx("label-tabs")}>Service</h4>
                  <div>{favouritesServices.length} mark</div>
                </div>
              </button>
            </div>

            <div className={cx("content-tabs")}>
              <div
                className={
                  toggleState === 1
                    ? cx("active-content")
                    : cx("content")
                }
              >
                {
                  favouritesRooms.length > 0 ?
                    favouritesRooms.map((favouriteRoom, index) => {
                      return (
                        <BookingCard
                          key={index}
                          id={favouriteRoom.id}
                          image={favouriteRoom.image}
                          title={favouriteRoom.title}
                          price={favouriteRoom.price}
                          ranking={favouriteRoom.ranking}
                          type={favouriteRoom.type}
                          capacity={favouriteRoom.capacity}
                          listRooms={favouriteRoom.listRooms}
                          area={favouriteRoom.area}
                          totalReviews={54}
                          disableFavouriteCheck={true}
                        />
                      )
                    })
                    : (
                      <div>
                        <h1 style={{textAlign: 'center'}}>There are no favorite rooms in your list yet</h1>
                      </div>
                    )
                }
              </div>

              <div
                className={
                  toggleState === 2
                    ? cx("active-content")
                    : cx("content")
                }
              >
                {
                  favouritesServices.length > 0 ?
                    favouritesServices.map((favouriteService, index) => {
                      return (
                        <BookingCard
                          key={index}
                          id={favouriteService.id}
                          image={favouriteService.image}
                          title={favouriteService.title}
                          price={favouriteService.price}
                          ranking={favouriteService.ranking}
                          type={favouriteService.type}
                          totalReviews={54}
                          disableFavouriteCheck={true}
                        />
                      )
                    })
                    : (
                      <div>
                        <h1 style={{textAlign: 'center'}}>There are no favorite services in your list yet</h1>
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Favourites;
