import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { fetchBirthdays } from '../../redux/actions/birthdays';
import Calendar from '../../components/Calendar';
import Modal from '../../components/Modal';
import BirthdayCard from '../../components/BirthdayCard';
import './style.scss';
import '../../styles/balloon.scss';

const Home =  ({
  birthdays,
  isFetching,
  isLoaded,
  fetchBirthdays,
  week,
  year,
}) => {

  const [showModal, setShowModal] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [selectedCard, selectCard] = useState(-1);
  const [weekList, setWeekList] = useState(birthdays);

  useEffect(() => {
    if(!isFetching && isLoaded) {
      setInProp(true);
    }
  }, [ birthdays, isFetching, isLoaded ]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBirthdays(week, year)
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const getNextWeek = () => {
    const nextWeek = moment().weekYear(year).week(week).add(1, 'w');
    fetchBirthdays(nextWeek.week(), nextWeek.weekYear());
  }

  const getPreviousWeek = () => {
    const previousWeek = moment().weekYear(year).week(week).subtract(1, 'w');
    fetchBirthdays(previousWeek.week(), previousWeek.weekYear());
  }

  return (
    <div className="birthday contained">
      <CSSTransition
        in={inProp}
        timeout={400}
        onEntered={()=> {
          setInProp(false);
          selectCard(-1);
          setWeekList(birthdays);
        }}
      ><div/></CSSTransition>

      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <Calendar
          activeStartDate={moment(weekList[0].date).toDate()}
          onClickDay={day => {
            const date = moment(day);
            fetchBirthdays(date.week(), date.weekYear());
            setShowModal(false);
          }}
        />
      </Modal>

      <button className="birthday__calendar-button" onClick={() => setShowModal(true)}>
        {moment(weekList[0].date).format('DD/MMM')} - {moment(weekList[6].date).format('DD/MMM')}
      </button>

      <div className="birthday__button-group">
        <button
          className="birthday__button"
          onClick={getPreviousWeek}
        >
          {'<'}
        </button>
        <button
          className="birthday__button"
          onClick={getNextWeek}
        >
          {'>'}
        </button>
      </div>

      <div className="birthday__card-list">
        {weekList.map((day, index) => (
          <div className="birthday__card-container" key={index}>
            <div className="balloon"/>
            <CSSTransition
              in={inProp}
              timeout={400}
              classNames="flip"
            >
              <BirthdayCard
                handleClick={() => selectCard(index === selectedCard ? -1 : index)}
                date={moment(day.date)}
                birthdays={day.birthdays}
                cardSelected={selectedCard === index}
              />
            </CSSTransition>
          </div>
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = ({birthdays : {
  results,
  isFetching,
  isLoaded,
  week,
  year,
}}) => ({
  birthdays: results,
  isLoaded,
  isFetching,
  week,
  year,
});

export default connect(
  mapStateToProps,
  {fetchBirthdays}
)(Home);