import _ from 'lodash';
import React from 'react';
import { buildHybridComponent } from '../../util/state-management';
import { lucidClassNames } from '../../util/style-helpers';
import { createClass, getFirst, omitProps } from '../../util/component-types';
import * as reducers from './DateSelect.reducers';
import InfiniteSlidePanel from '../InfiniteSlidePanel/InfiniteSlidePanel';
import CalendarMonth from '../CalendarMonth/CalendarMonth';
import ChevronThinIcon from '../Icon/ChevronThinIcon/ChevronThinIcon';

const cx = lucidClassNames.bind('&-DateSelect');

const {
	any,
	bool,
	func,
	instanceOf,
	number,
	oneOf,
	string,
} = React.PropTypes;

/**
 * {"categories": ["controls", "selectors"], "madeFrom": ["InfiniteSlidePanel", "CalendarMonth"]}
 *
 * Date selection component capabaple of supporting single date and date range
 * selections.
 */
const DateSelect = createClass({
	displayName: 'DateSelect',

	components: {
		/**
		 * Child component to pass thru props to underlying CalendarMonth.
		 */
		CalendarMonth: createClass({
			displayName: 'DateSelect.CalendarMonth',
			propName: 'CalendarMonth',
		}),
	},

	propTypes: {
		/**
		 * Appended to the component-specific class names set on the root element.
		 */
		className: string,

		/**
		 * Number of calendar months to show.
		 */
		monthsShown: number,

		/**
		 * Number of calendar months rendered at any given time (including those
		 * out of view).
		 */
		calendarsRendered: number,

		/**
		 * The offset of the leftmost month in view, where 0 is the `initialMonth`.
		 * Negative values will show previous months.
		 */
		offset: number,

		/**
		 * Sets the start date in a date range.
		 */
		from: instanceOf(Date),

		/**
		 * Sets the end date in a date range.
		 */
		to: instanceOf(Date),

		/**
		 * The next selection that is expected. Primarily used to preview expected
		 * ranges when the cursor is on a target date.
		 */
		selectMode: oneOf(['day', 'from', 'to']),

		/**
		 * Sets first month in view on render. The 0 value for the `offset` prop
		 * refers to this month.
		 */
		initialMonth: instanceOf(Date),

		/**
		 * Sets selected days. Passed through to `CalendarMonth` ->
		 * `react-day-picker`. Can be a `Date`, array of `Date`s or a function with
		 * the signature `(date) => Boolean`.
		 */
		selectedDays: any,

		/**
		 * Sets disabled days. Passed through to `CalendarMonth` ->
		 * `react-day-picker`. Can be a `Date`, array of `Date`s or a function with
		 * the signature `(date) => Boolean`.
		 */
		disabledDays: any,

		/**
		 * Display a divider between each month.
		 */
		showDivider: bool,

		/**
		 * Called when user's swipe would change the month `offset`. Callback
		 * passes number of months swiped by the user (positive for forward swipes,
		 * negative for backwards swipes).
		 *
		 * Signature: `(monthsSwiped, { event, props }) => {}`
		 */
		onSwipe: func,

		/**
		 * Called when user clicks the previous button.
		 *
		 * Signature: `({ event, props }) => {}`
		 */
		onPrev: func,

		/**
		 * Called when user clicks the next button.
		 *
		 * Signature: `({ event, props }) => {}`
		 */
		onNext: func,

		/**
		 * Called when user selects a date. Callback passes a Date object as the
		 * first argument.
		 *
		 * Signature: `(selectedDate, { event, props }) => {}`
		 */
		onSelectDate: func,
	},

	getDefaultProps() {
		return {
			monthsShown: 1,
			calendarsRendered: 12,
			offset: 0,
			from: null,
			to: null,
			initialMonth: new Date(),
			selectedDays: null,
			disabledDays: null,
			showDivider: false,
			onSwipe: _.noop,
			onPrev: _.noop,
			onNext: _.noop,
			onSelectDate: _.noop,
		};
	},

	reducers,

	getInitialState() {
		return {
			cursor: null,
		};
	},

	handleDayClick(day, { disabled }, event) {
		const {
			onSelectDate,
		} = this.props;

		if (!disabled) {
			onSelectDate(day, {event, props: this.props});
		}
	},

	handleDayMouseEnter(day, { disabled }) {
		if (disabled) {
			this.setState({
				cursor: null,
			});
		} else {
			this.setState({
				cursor: day,
			});
		}
	},

	handleDayMouseLeave() {
		this.setState({
			cursor: null,
		});
	},

	handlePrev(event) {
		this.props.onPrev({event, props: this.props});
	},

	handleNext(event) {
		this.props.onNext({event, props: this.props});
	},

	componentWillMount() {
		this.initialMonth = new Date(this.props.initialMonth);
	},

	render() {
		const {
			className,
			monthsShown,
			calendarsRendered,
			offset,
			from,
			to,
			selectMode,
			selectedDays,
			disabledDays,
			showDivider,
			onSwipe,
			...passThroughs
		} = this.props;

		const {
			cursor,
		} = this.state;

		const calendarMonth = getFirst(this.props, DateSelect.CalendarMonth, <DateSelect.CalendarMonth />);

		return (
			<section
				className={cx('&', className, {
					'&-show-divider': showDivider,
				})}
				style={{
					minWidth: 64 + 185 * monthsShown,
					...passThroughs.style,
				}}
				{...omitProps(passThroughs, DateSelect)}
			>
				<div>
					<ChevronThinIcon size={32} isClickable direction='left' onClick={this.handlePrev} />
				</div>
				<InfiniteSlidePanel
					className={cx('&-InfiniteSlidePanel')}
					totalSlides={calendarsRendered}
					slidesToShow={monthsShown}
					offset={offset}
					onSwipe={onSwipe}
				>
					<InfiniteSlidePanel.Slide className={cx('&-slide')}>
						{(slideOffset) => (
							<div
								className={cx('&-slide-content')}
							>
								<CalendarMonth
									monthOffset={slideOffset}
									initialMonth={this.initialMonth}
									cursor={cursor}
									from={from}
									to={to}
									selectedDays={selectedDays}
									disabledDays={disabledDays}
									selectMode={selectMode}
									onDayClick={this.handleDayClick}
									onDayMouseEnter={this.handleDayMouseEnter}
									onDayMouseLeave={this.handleDayMouseLeave}

									// Only update CalendarMonths within frame or one position away:
									shouldComponentUpdate={slideOffset - offset >= -1 && slideOffset - offset < monthsShown + 1}

									{...calendarMonth.props}
								/>
							</div>
						)}
					</InfiniteSlidePanel.Slide>
				</InfiniteSlidePanel>
				<div>
					<ChevronThinIcon size={32} isClickable direction='right' onClick={this.handleNext} />
				</div>
			</section>
		);
	},
});

export default buildHybridComponent(DateSelect);
export { DateSelect as DateSelectDumb };