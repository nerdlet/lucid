import _ from 'lodash';
import React from 'react';
import Icon from '../Icon';
import { lucidClassNames } from '../../../util/style-helpers';
import { createClass, omitProps } from '../../../util/component-types';

import './PlusIcon.less';

const cx = lucidClassNames.bind('&-PlusIcon');

const PlusIcon = createClass({
	displayName: 'PlusIcon',

	statics: {
		peek: {
			description: `
				A plus icon.
			`,
			categories: ['visual design', 'icons'],
			extend: 'Icon',
			madeFrom: ['Icon'],
		},
	},

	propTypes: {
		...Icon.propTypes,
	},

	render() {
		const { className, ...passThroughs } = this.props;

		return (
			<Icon
				{...omitProps(passThroughs, PlusIcon, [], false)}
				{..._.pick(passThroughs, _.keys(Icon.propTypes))}
				className={cx('&', className)}
			>
				<path d="M1,6.6h14v2.8H1V6.6z" />
				<path d="M6.6,1v14h2.8V1H6.6z" />
			</Icon>
		);
	},
});

export default PlusIcon;
