import { useState } from 'react';
import Moment from 'moment';
import {
  DateTimePicker,
  FormGroup,
  Input,
  InputLabel,
  Select,
  Tags,
} from '../Form';
import * as Api from 'api';
import { LIVE_EVENTS_CATEGORIES } from 'constants/EventCategories';
import styles from './styles.module.scss';
import { connect } from 'react-redux';
import { setUniqueSlug } from '../../helper/Slug';

const categoriesOptions = LIVE_EVENTS_CATEGORIES.map(c => ({
  label: c.value,
  value: c.value,
}));

const AdminEventForm = ({ event = null, eventSlugs }) => {
  const [name, setName] = useState(event?.name || '');
  const [slug, setSlug] = useState(event?.slug || '');
  const [streamUrl, setStreamUrl] = useState(event?.streamUrl || '');
  const [previewImageUrl, setPreviewImageUrl] = useState(
    event?.previewImageUrl || ''
  );
  const [category, setCategory] = useState(
    event?.category || categoriesOptions[0].value
  );
  const [tags, setTags] = useState(
    event?.tags || [{ _id: Date.now().toString(), name: '' }]
  );
  const [date, setDate] = useState(event?.date || new Moment());

  const onNameChange = newName => {
    const slugs =
      event === null ? eventSlugs : eventSlugs.filter(s => s !== event?.slug);

    setName(newName);
    setUniqueSlug(newName, slugs, setSlug);
  };

  const handleSuccess = ({ response: { data } }) => {
    // there is a strange bug when I use history.push(); to navigate, layout becomes white
    window.location.reload();
  };

  const handleSave = () => {
    const payload = {
      name,
      slug,
      streamUrl,
      previewImageUrl,
      category,
      tags: tags.map(t => ({ name: t.name })).filter(t => t.name !== ''),
      date,
      type: event ? event.type : 'streamed',
    };

    if (event) {
      Api.editEvent(event._id, payload).then(handleSuccess);
    } else {
      Api.createEvent(payload).then(handleSuccess);
    }
  };

  const handleTagChange = (name, id) => {
    setTags(prevTags =>
      prevTags.map(tag => (tag._id === id ? { ...tag, name } : tag))
    );
  };

  const addTag = () => {
    setTags(prevTags => [
      ...prevTags,
      { _id: Date.now().toString(), name: '' },
    ]);
  };

  const removeTag = id => {
    setTags(prevTags => prevTags.filter(tag => tag._id !== id));
  };

  return (
    <>
      <FormGroup>
        <InputLabel>Event Name</InputLabel>
        <Input type="text" value={name} onChange={onNameChange} />
      </FormGroup>
      <FormGroup>
        <InputLabel>SEO-Optimized URL Piece</InputLabel>
        <Input type="text" value={slug} onChange={setSlug} />
      </FormGroup>
      <FormGroup>
        <InputLabel>Stream URL</InputLabel>
        <Input type="text" value={streamUrl} onChange={setStreamUrl} />
      </FormGroup>
      <FormGroup>
        <InputLabel>Offline Picture URL</InputLabel>
        <Input
          type="text"
          value={previewImageUrl}
          onChange={setPreviewImageUrl}
        />
      </FormGroup>
      <FormGroup>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          handleSelect={setCategory}
          options={categoriesOptions}
        />
      </FormGroup>
      <FormGroup>
        <InputLabel>Tags</InputLabel>
        <Tags
          tags={tags}
          onTagChange={handleTagChange}
          addTag={addTag}
          removeTag={removeTag}
        />
      </FormGroup>
      <FormGroup>
        <InputLabel>Date</InputLabel>
        <DateTimePicker
          value={date}
          onChange={date => setDate(date)}
          ampm={false}
        />
      </FormGroup>
      <span
        role="button"
        tabIndex="0"
        className={styles.button}
        onClick={handleSave}
      >
        Save
      </span>
    </>
  );
};

const mapStateToProps = state => {
  return {
    eventSlugs: state.event.events.map(({ slug }) => slug).filter(Boolean),
  };
};

export default connect(mapStateToProps, null)(AdminEventForm);
