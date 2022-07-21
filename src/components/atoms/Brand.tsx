import BrandImage from '@/assets/images/logo.svg';
import { Image, ImageProps } from 'antd';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import useConfigurations from '../providers/useConfigurations';

export type BrandProps = {
	to?: string;
} & ImageProps;

export const Brand: FC<BrandProps> = ({ to: slug, ...rest }) => {
	const { data } = useConfigurations();
	if (slug) {
		return (
			<Link to={slug}>
				<Image src={data?.logo || BrandImage} preview={false} {...rest} />
			</Link>
		);
	}

	return <Image src={data?.logo || BrandImage} preview={false} {...rest} />;
};

Brand.defaultProps = {
	width: '120px',
};
