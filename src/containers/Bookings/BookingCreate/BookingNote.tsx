import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
type BookingNoteProps = {
	bookingId: number;
};

function BookingNote({ bookingId }: BookingNoteProps) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [note, setNote] = useState('');

	const { data } = useQuery('booking-notes', () => bookingsAPI.getBookingNotes(bookingId), {
		onError: (error: Error) => {
			message.error(error.message);
		},
	});
	const notes = data?.results;

	const { mutate: deleteNote } = useMutation(
		(noteId: number) => bookingsAPI.deleteBookingNotes(noteId),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['booking-notes']);
				console.log(' updated  data !!');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const { mutate, isLoading } = useMutation(
		() =>
			bookingsAPI.createBookingNotes({
				booking: bookingId,
				note,
			}),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['booking-notes']);
				console.log(' updated  data !!');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const handleCreateNote = () => {
		mutate();
		setNote('');
	};

	return (
		<Wrapper>
			<Typography.Title level={5}>{t('Comments and notes')}</Typography.Title>
			<div style={{ marginBottom: '20px' }}>
				{notes?.map((note) => {
					return (
						<div key={note.id} style={{ marginBottom: '16px' }}>
							<Space align='center'>
								<div>
									<Typography.Text
										type='secondary'
										style={{ fontWeight: 'bolder' }}
									>{`${note.created_by?.first_name} ${note?.created_by?.last_name}`}</Typography.Text>
									<Typography.Text type='secondary' style={{ marginLeft: '10px' }}>
										{moment(note?.created_at).format(config.dateTimeFormatReadableAmPm)}
									</Typography.Text>
									<br />
									<Typography.Text>{note.note}</Typography.Text>
								</div>
								<Popconfirm
									title={t('Are you sure want to delete this note ?')}
									onConfirm={() => {
										deleteNote(note.id);
									}}
								>
									<Button type='link' size='small' danger icon={<DeleteOutlined />}></Button>
								</Popconfirm>
							</Space>
						</div>
					);
				})}
			</div>

			<div>
				<Input.TextArea
					rows={3}
					value={note}
					onChange={(e) => {
						setNote(e.target.value);
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'end' }}>
					<Button
						onClick={handleCreateNote}
						type='primary'
						style={{ marginTop: '16px' }}
						loading={isLoading}
					>
						{t('Add note')}
					</Button>
				</div>
			</div>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
	display: block;
	margin-bottom: 20px;
`;

export default BookingNote;
