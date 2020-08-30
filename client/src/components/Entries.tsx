import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createDiaryEntry, deleteDiaryEntry, getDiaryEntries, patchDiaryEntry } from '../api/entries-api'
import Auth from '../auth/Auth'
import { DiaryEntry } from '../types/DiaryEntry'

interface EntriesProps {
  auth: Auth
  history: History
}

interface EntriesState {
  entries: DiaryEntry[]
  newEntryTitle: string
  newEntryContent: string
  loadingEntries: boolean
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryTitle: '',
    newEntryContent: '',
    loadingEntries: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryTitle: event.target.value })
  }

  handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryContent: event.target.value })
  }

  onEditButtonClick = (diaryEntryId: string) => {
    this.props.history.push(`/entries/${diaryEntryId}/edit`)
  }

  onEntryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newEntry = await createDiaryEntry(this.props.auth.getIdToken(), {
        title: this.state.newEntryTitle,
        content: this.state.newEntryContent,
      })
      this.setState({
        entries: [...this.state.entries, newEntry],
        newEntryTitle: '',
        newEntryContent: ''
      })
    } catch {
      alert('Diary entry creation failed')
    }
  }

  onEntryDelete = async (diaryEntryId: string) => {
    try {
      await deleteDiaryEntry(this.props.auth.getIdToken(), diaryEntryId)
      this.setState({
        entries: this.state.entries.filter(entry => entry.diaryEntryId != diaryEntryId)
      })
    } catch {
      alert('Diary entry deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const entries = await getDiaryEntries(this.props.auth.getIdToken())
      this.setState({
        entries,
        loadingEntries: false
      })
    } catch (e) {
      alert(`Failed to fetch diary entries: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Diary Entries</Header>

        {this.renderCreateDiaryEntryInput()}

        {this.renderDiaryEntries()}
      </div>
    )
  }
  
  renderCreateDiaryEntryInput() {
    // TODO: handle content entry change...
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New diary entry',
              onClick: this.onEntryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Diary entry title goes here..."
            onChange={this.handleTitleChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDiaryEntries() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderDiaryEntryList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Diary Entries
        </Loader>
      </Grid.Row>
    )
  }

  renderDiaryEntryList() {
    return (
      <Grid padded>
        {this.state.entries.map((entry, pos) => {
          return (
            <Grid.Row key={entry.diaryEntryId}>
              <Grid.Column width={10} verticalAlign="middle">
                {entry.title}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {entry.content}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(entry.diaryEntryId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEntryDelete(entry.diaryEntryId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {entry.attachmentUrl && (
                <Image src={entry.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
