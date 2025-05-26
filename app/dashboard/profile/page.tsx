export default function DashboardProfile() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h1>
          <p className="text-gray-600">
            Congratulations! You have successfully completed the onboarding process. Your profile is now set up and
            ready to use.
          </p>
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Next Steps:</h2>
            <ul className="text-green-700 space-y-1">
              <li>• Your medical registration is being verified</li>
              <li>• You'll receive an email once verification is complete</li>
              <li>• Start managing your appointments and availability</li>
              <li>• Update your profile information anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
