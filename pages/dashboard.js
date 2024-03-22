import { connectToDatabase } from '../lib/db';

const Dashboard = ({ outputs }) => {
  return (
    <div>
      <h1>Generated Outputs</h1>
      <ul>
        {outputs.map((output, index) => (
          <li key={index}>
            <p>{output.output}</p>
            <p>Timestamp: {output.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  const db = await connectToDatabase();
  const collection = db.collection('generatedOutputs');
  const outputs = await collection.find().toArray();
  return {
    props: {
      outputs: JSON.parse(JSON.stringify(outputs)),
    },
  };
}

export default Dashboard;
