import React from 'react';
import AlertMessage from '../components/AlertMessage'

function ProfilePage(props) {
  return (
    <div className="Page-wrapper">
      <h1>Profile</h1>

      <AlertMessage text="Profile page is in development. Soon it will be possible to edit profile."/>

      <section className="Profile">
        <div className="light-background-with-padding">
          <form className="Form" onSubmit={() => {}} style={{opacity: .6}}>
            <div>
              <div className="Form-group">
                <label htmlFor="display-name">Display Name</label>
                <input
                  type="text"
                  name="display-name"
                  id="display-name"
                  defaultValue=""
                  disabled
                />
              </div>
              <div className="form-group">
                <button disabled type="submit" className="btn-primary">
                  Save Display Name
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/*<section className="Creator registration">*/}
      {/*  <div className="Form-group">*/}
      {/*    <form onSubmit={() => creatorRegistration()}>*/}
      {/*      <div className="Form-group">*/}
      {/*        <button type="submit">*/}
      {/*          Become a creator*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </form>*/}
      {/*  </div>*/}
      {/*</section>*/}
    </div>
  );
}

export default ProfilePage;