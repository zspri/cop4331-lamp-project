<?php
    
	$inData = getRequestInfo();

	$id     = $inData["id"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare(
			"DELETE FROM Contacts WHERE ID = ? AND UserID = ?"
		);
		$stmt->bind_param("ii", $id, $userId);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnWithInfo($id);
		}
		else
		{
			returnWithError("Contact Could Not Be Deleted");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($id)
	{
		$retValue = '{"id":' . $id . ',"firstName":"","lastName":"","error":""}';
		sendResultInfoAsJson($retValue);
	}

?>
