import React from 'react'
import PropTypes from 'prop-types'
import Play from 'components/Timeline/Playbook/Play'
import { TestConditionSet } from 'services/playbookService'

export const DisplayPlaybook = ({
    actions,
    eventTypeId,
    eventId,
    ticketId,
    engagementId,
    incidentId
}) => {
  let localKey = 0
  return <div>
    {actions.map(action =>
      <div key={localKey++}>
        <span>
          {action.name}
        </span>
        <br />
        <Play
          action={action}
          eventTypeId={eventTypeId}
          eventId={eventId}
          incidentId={incidentId}
          ticketId={ticketId}
          engagementId={engagementId}
                />
      </div>
        )}
  </div>
}

DisplayPlaybook.propTypes = {
  actions: PropTypes.array.isRequired,
  eventTypeId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  ticketId: PropTypes.string.isRequired,
  engagementId: PropTypes.number,
  incidentId: PropTypes.number.isRequired
}

export const mapStateToDisplayPlaybookProps = (state, ownProps) => {
  const auth = state.auth

  const eventType = state.eventTypes.records[ownProps.eventTypeId]
  const event = Object.values(state.events.list.list)
        .find(event => event.id === ownProps.eventId)
  const ticket = state.tickets.map[ownProps.ticketId]
  const engagement = state.engagements.list.find(
        engagement => engagement &&
        engagement.incidentId === ownProps.incidentId &&
        engagement.participant &&
        engagement.participant.alias === auth.userAlias &&
        engagement.participant.team === auth.userTeam &&
        engagement.participant.role === auth.userRole
    )

  const actions = eventType.actions
  var populatedConditionSetTest = TestConditionSet(event, ticket, eventType, engagement)
  const qualifiedActions = actions.filter(
        action => action.conditionSets.reduce(
            (allConditionSetsMet, currentConditionSet) => allConditionSetsMet
                ? populatedConditionSetTest(currentConditionSet)
                : false,
            true
        )
    )

  return {
    actions: qualifiedActions,
    engagementId: engagement ? engagement.id : null,
    ...ownProps
  }
}

export default DisplayPlaybook
