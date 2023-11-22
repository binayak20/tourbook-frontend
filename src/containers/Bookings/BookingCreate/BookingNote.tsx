import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, message } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
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
	const [currentNote, setCurrentNote] = useState<API.BookingNote | null>(null);

	const bookingNotesParam: API.BookingNoteParams = useMemo(() => {
		return {
			booking: bookingId,
		};
	}, [bookingId]);

	const { data } = useQuery(
		['booking-notes', bookingNotesParam],
		() => bookingsAPI.getBookingNotes(bookingNotesParam),
		{
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const notes = data?.results;

	const { mutate: updateNote, isLoading: isUpdateLoading } = useMutation(
		(noteId: number) =>
			bookingsAPI.updateBookingNote(noteId, {
				booking: bookingId,
				note: currentNote?.note as string,
			}),
		{
			onSuccess: () => {
				setCurrentNote(null);
				queryClient.invalidateQueries(['booking-notes']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: deleteNote } = useMutation(
		(noteId: number) => bookingsAPI.deleteBookingNote(noteId),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['booking-notes']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const { mutate: createNote, isLoading } = useMutation(
		() =>
			bookingsAPI.createBookingNote({
				booking: bookingId,
				note,
			}),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['booking-notes']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const handleCreateNote = () => {
		createNote();
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
									<Space align='center'>
										<Typography.Text
											type='secondary'
											style={{ fontWeight: 'bolder' }}
										>{`${note.created_by?.first_name} ${note?.created_by?.last_name}`}</Typography.Text>
										<Typography.Text type='secondary' style={{ marginLeft: '10px' }}>
											{dayjs(note?.updated_at).format(config.dateTimeFormatReadableAmPm)}
										</Typography.Text>
										{!(currentNote?.id === note?.id) && (
											<div>
												<Button
													onClick={() => {
														setCurrentNote(note);
													}}
													type='link'
													size='small'
													danger
													icon={<EditOutlined />}
												></Button>
												<Popconfirm
													title={t('Do you really want to delete this note?')}
													onConfirm={() => {
														deleteNote(note.id);
													}}
												>
													<Button
														type='link'
														size='small'
														danger
														icon={<DeleteOutlined />}
													></Button>
												</Popconfirm>
											</div>
										)}
									</Space>
									<br />
									{currentNote?.id === note?.id ? (
										<div>
											<Input.TextArea
												rows={3}
												value={currentNote?.note}
												onChange={(e) => {
													setCurrentNote({ ...currentNote, note: e.target.value });
												}}
											/>
											<div
												style={{
													marginTop: '5px',
													display: 'flex',
													justifyContent: 'end',
												}}
											>
												<Button danger size='small' onClick={() => setCurrentNote(null)}>
													{t('Cancel')}
												</Button>
												<Button
													style={{ marginLeft: '5px' }}
													size='small'
													onClick={() => updateNote(currentNote?.id, {})}
													type='primary'
													loading={isUpdateLoading}
												>
													{t('Update note')}
												</Button>
											</div>
										</div>
									) : (
										<Typography.Text>{note.note}</Typography.Text>
									)}
								</div>
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
