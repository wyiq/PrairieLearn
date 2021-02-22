-- BLOCK insert_mock_user_submissions

SELECT iq.*
    FROM assessment_questions AS aq
    JOIN assessments AS a ON (a.id = aq.assessment_id)
    JOIN instance_questions AS iq ON (iq.assessment_question_id = aq.id)
WHERE a.tid = 'hw1-automaticTestSuite';

-- BLOCK get_assessment_hw1
SELECT *
    FROM assessments
WHERE tid = 'hw1-automaticTestSuite';
